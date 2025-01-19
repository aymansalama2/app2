import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { motion } from "framer-motion";
import { ChartBarIcon, UserGroupIcon, CashIcon, CogIcon } from "@heroicons/react/solid";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", investissements: "50,000€", status: "actif" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", investissements: "75,000€", status: "en attente" },
  ]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [transactionType, setTransactionType] = useState("depot");
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", investissements: "" });

  const revenueChartRef = useRef(null);
  const investmentChartRef = useRef(null);

  // Fonction pour gérer les transactions
  const handleTransaction = (userId, type, amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Veuillez entrer un montant valide");
      return;
    }

    setUsers(users.map(user => {
      if (user.id === userId) {
        const currentAmount = parseInt(user.investissements.replace(/[^0-9]/g, ""));
        const newAmount = type === "depot" 
          ? currentAmount + parseInt(amount)
          : currentAmount - parseInt(amount);
        
        if (type === "retrait" && newAmount < 0) {
          alert("Solde insuffisant pour effectuer ce retrait");
          return user;
        }

        return {
          ...user,
          investissements: `${newAmount.toLocaleString()}€`
        };
      }
      return user;
    }));
    setShowTransactionModal(false);
    setTransactionAmount("");
  };

  // Fonction pour ajouter un nouvel utilisateur
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.investissements) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers([...users, {
      id: newId,
      ...newUser,
      status: "actif",
      investissements: `${parseInt(newUser.investissements).toLocaleString()}€`
    }]);
    setShowAddUserModal(false);
    setNewUser({ name: "", email: "", investissements: "" });
  };

  // Fonction pour gérer le statut des utilisateurs
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === "actif" ? "inactif" : "actif"
        };
      }
      return user;
    }));
  };

  // Fonction pour filtrer les utilisateurs
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (revenueChartRef.current) {
      revenueChartRef.current.destroy();
    }
    if (investmentChartRef.current) {
      investmentChartRef.current.destroy();
    }

    const revenueCtx = document.getElementById("revenueChart")?.getContext("2d");
    if (revenueCtx) {
      revenueChartRef.current = new Chart(revenueCtx, {
        type: "bar",
        data: {
          labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
          datasets: [
            {
              label: "Revenus",
              data: [12000, 15000, 14000, 17000, 19000, 22000],
              backgroundColor: "rgba(234, 179, 8, 0.5)",
              borderColor: "rgb(234, 179, 8)",
              borderWidth: 1,
            },
            {
              label: "Dépenses",
              data: [8000, 9000, 10000, 11000, 12000, 13000],
              backgroundColor: "rgba(239, 68, 68, 0.5)",
              borderColor: "rgb(239, 68, 68)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { 
            legend: { position: "top" },
            title: {
              display: true,
              text: "Évolution des revenus et dépenses",
              color: "rgb(209, 213, 219)",
              font: { size: 16 }
            }
          },
          scales: {
            y: {
              grid: { color: "rgba(107, 114, 128, 0.1)" },
              ticks: { color: "rgb(209, 213, 219)" }
            },
            x: {
              grid: { color: "rgba(107, 114, 128, 0.1)" },
              ticks: { color: "rgb(209, 213, 219)" }
            }
          }
        },
      });
    }

    const investmentCtx = document.getElementById("investmentChart")?.getContext("2d");
    if (investmentCtx) {
      investmentChartRef.current = new Chart(investmentCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
          datasets: [{
            label: "Total des investissements",
            data: [100000, 125000, 150000, 175000, 200000, 250000],
            borderColor: "rgb(234, 179, 8)",
            backgroundColor: "rgba(234, 179, 8, 0.1)",
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: { 
            legend: { position: "top" },
            title: {
              display: true,
              text: "Progression des investissements",
              color: "rgb(209, 213, 219)",
              font: { size: 16 }
            }
          },
          scales: {
            y: {
              grid: { color: "rgba(107, 114, 128, 0.1)" },
              ticks: { color: "rgb(209, 213, 219)" }
            },
            x: {
              grid: { color: "rgba(107, 114, 128, 0.1)" },
              ticks: { color: "rgb(209, 213, 219)" }
            }
          }
        },
      });
    }

    return () => {
      if (revenueChartRef.current) {
        revenueChartRef.current.destroy();
      }
      if (investmentChartRef.current) {
        investmentChartRef.current.destroy();
      }
    };
  }, []);

  const StatCard = ({ title, value, change, icon }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <span className="text-yellow-400 bg-yellow-400/10 p-3 rounded-full">
          {icon}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-white">{value}</p>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          change >= 0 
            ? "text-green-400 bg-green-400/10" 
            : "text-red-400 bg-red-400/10"
        }`}>
          {change >= 0 ? "+" : ""}{change}%
        </span>
      </div>
    </motion.div>
  );

  // Modal de transaction
  const TransactionModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">
          {transactionType === "depot" ? "Effectuer un dépôt" : "Effectuer un retrait"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Montant</label>
            <input
              type="number"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Montant en €"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowTransactionModal(false)}
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => handleTransaction(selectedUser.id, transactionType, transactionAmount)}
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Confirmer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Modal d'ajout d'utilisateur
  const AddUserModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Ajouter un utilisateur</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Nom complet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="email@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Investissement initial</label>
            <input
              type="number"
              value={newUser.investissements}
              onChange={(e) => setNewUser({...newUser, investissements: e.target.value})}
              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Montant en €"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-yellow-400">Dashboard Administrateur</h1>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              onClick={() => {
                // Logique d'export
                alert("Fonctionnalité d'export en développement");
              }}
            >
              Exporter les données
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              onClick={() => setShowAddUserModal(true)}
            >
              Ajouter un utilisateur
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-4 mb-8 bg-gray-800 p-2 rounded-lg border border-gray-700"
        >
          {[
            { name: "dashboard", icon: <ChartBarIcon className="w-5 h-5" /> },
            { name: "utilisateurs", icon: <UserGroupIcon className="w-5 h-5" /> },
            { name: "investissements", icon: <CashIcon className="w-5 h-5" /> },
            { name: "paramètres", icon: <CogIcon className="w-5 h-5" /> }
          ].map((tab) => (
            <motion.button
              key={tab.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                activeTab === tab.name
                  ? "bg-yellow-400 text-black"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab.icon}
              <span>{tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {activeTab === "dashboard" && (
            <>
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Utilisateurs"
                  value={users.length.toString()}
                  change={12}
                  icon={<UserGroupIcon className="w-6 h-6" />}
                />
                <StatCard
                  title="Investissements"
                  value="2.1M€"
                  change={8}
                  icon={<CashIcon className="w-6 h-6" />}
                />
                <StatCard
                  title="Rendement Moyen"
                  value="15.4%"
                  change={-2}
                  icon={<ChartBarIcon className="w-6 h-6" />}
                />
                <StatCard
                  title="Transactions"
                  value="845"
                  change={5}
                  icon={<CogIcon className="w-6 h-6" />}
                />
              </div>

              {/* Graphiques */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-4 text-white">Revenus et Dépenses</h3>
                  <canvas id="revenueChart"></canvas>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-4 text-white">Croissance des Investissements</h3>
                  <canvas id="investmentChart"></canvas>
                </motion.div>
              </div>
            </>
          )}

          {activeTab === "utilisateurs" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg shadow-xl border border-gray-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Gestion des Utilisateurs</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher un utilisateur..."
                      className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                    <span className="absolute left-3 top-2.5">🔍</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Investissements
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredUsers.map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                          className="hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center mr-3 font-semibold">
                                {user.name.charAt(0)}
                              </div>
                              <span className="text-white">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-yellow-400">{user.investissements}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === "actif" 
                                ? "bg-green-400/20 text-green-400" 
                                : "bg-yellow-400/20 text-yellow-400"
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setTransactionType("depot");
                                  setShowTransactionModal(true);
                                }}
                                className="text-green-400 hover:text-green-300 transition-colors"
                              >
                                Dépôt
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setTransactionType("retrait");
                                  setShowTransactionModal(true);
                                }}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                Retrait
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleUserStatus(user.id)}
                                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                              >
                                {user.status === "actif" ? "Désactiver" : "Activer"}
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {showTransactionModal && <TransactionModal />}
      {showAddUserModal && <AddUserModal />}
    </div>
  );
};

export default Admin;
