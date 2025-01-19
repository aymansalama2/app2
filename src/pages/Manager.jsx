import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import {
  UserIcon,
  CashIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "@heroicons/react/outline";

const Manager = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState(null);

  // États pour les données
  const [managerData, setManagerData] = useState({
    totalInvestors: 156,
    totalInvestments: 2500000,
    monthlyGrowth: 12.5,
    activeProjects: 8,
    investors: [
      {
        id: 1,
        name: "Jean Dupont",
        email: "jean.dupont@email.com",
        investedAmount: 150000,
        portfolioValue: 175000,
        performance: 16.67,
        risk: "Modéré",
        lastActivity: "2024-03-15",
        status: "actif",
      },
      {
        id: 2,
        name: "Marie Martin",
        email: "marie.martin@email.com",
        investedAmount: 250000,
        portfolioValue: 285000,
        performance: 14,
        risk: "Élevé",
        lastActivity: "2024-03-14",
        status: "actif",
      },
      // Ajoutez plus d'investisseurs ici
    ],
    monthlyStats: {
      labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
      investments: [1800000, 2000000, 2200000, 2350000, 2450000, 2500000],
      returns: [90000, 100000, 110000, 117500, 122500, 125000],
    },
    riskDistribution: {
      low: 30,
      moderate: 45,
      high: 25,
    },
  });

  // État pour le formulaire d'ajout d'investisseur
  const [newInvestor, setNewInvestor] = useState({
    name: "",
    email: "",
    initialInvestment: "",
    risk: "moderate",
  });

  // Configuration des graphiques
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  const handleAddInvestor = (e) => {
    e.preventDefault();
    const newId = managerData.investors.length + 1;
    const newInvestorData = {
      id: newId,
      name: newInvestor.name,
      email: newInvestor.email,
      investedAmount: parseFloat(newInvestor.initialInvestment),
      portfolioValue: parseFloat(newInvestor.initialInvestment),
      performance: 0,
      risk: newInvestor.risk,
      lastActivity: new Date().toISOString().split("T")[0],
      status: "actif",
    };

    setManagerData(prev => ({
      ...prev,
      investors: [...prev.investors, newInvestorData],
      totalInvestors: prev.totalInvestors + 1,
      totalInvestments: prev.totalInvestments + parseFloat(newInvestor.initialInvestment),
    }));

    setShowAddModal(false);
    setNewInvestor({
      name: "",
      email: "",
      initialInvestment: "",
      risk: "moderate",
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInvestors = managerData.investors.filter(investor =>
    investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Total Investisseurs</p>
              <p className="text-2xl font-bold text-white">{managerData.totalInvestors}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center">
            <CashIcon className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Total Investissements</p>
              <p className="text-2xl font-bold text-white">
                {managerData.totalInvestments.toLocaleString()}€
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Croissance Mensuelle</p>
              <p className="text-2xl font-bold text-green-400">
                +{managerData.monthlyGrowth}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Projets Actifs</p>
              <p className="text-2xl font-bold text-white">{managerData.activeProjects}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Évolution des Investissements</h3>
          <Line
            data={{
              labels: managerData.monthlyStats.labels,
              datasets: [
                {
                  label: "Investissements",
                  data: managerData.monthlyStats.investments,
                  borderColor: "rgb(250, 204, 21)",
                  tension: 0.3,
                },
                {
                  label: "Rendements",
                  data: managerData.monthlyStats.returns,
                  borderColor: "rgb(34, 197, 94)",
                  tension: 0.3,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Distribution des Risques</h3>
          <Doughnut
            data={{
              labels: ["Faible", "Modéré", "Élevé"],
              datasets: [
                {
                  data: [
                    managerData.riskDistribution.low,
                    managerData.riskDistribution.moderate,
                    managerData.riskDistribution.high,
                  ],
                  backgroundColor: [
                    "rgb(34, 197, 94)",
                    "rgb(250, 204, 21)",
                    "rgb(239, 68, 68)",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "right",
                  labels: {
                    color: "white",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Rechercher un investisseur..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium ml-4"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un investisseur
        </motion.button>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Investisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Montant Investi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Valeur Portfolio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Risque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Dernière Activité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredInvestors.map((investor) => (
                <motion.tr
                  key={investor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                  className="hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedInvestor(investor)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{investor.name}</div>
                      <div className="text-sm text-gray-400">{investor.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {investor.investedAmount.toLocaleString()}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {investor.portfolioValue.toLocaleString()}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      investor.performance > 0
                        ? "bg-green-900 text-green-200"
                        : "bg-red-900 text-red-200"
                    }`}>
                      {investor.performance > 0 ? "+" : ""}
                      {investor.performance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {investor.risk}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(investor.lastActivity).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      investor.status === "actif"
                        ? "bg-green-900 text-green-200"
                        : "bg-gray-700 text-gray-300"
                    }`}>
                      {investor.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AddInvestorModal = () => (
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Nouvel Investisseur</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddInvestor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={newInvestor.name}
                  onChange={(e) =>
                    setNewInvestor({ ...newInvestor, name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newInvestor.email}
                  onChange={(e) =>
                    setNewInvestor({ ...newInvestor, email: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investissement initial (€)
                </label>
                <input
                  type="number"
                  value={newInvestor.initialInvestment}
                  onChange={(e) =>
                    setNewInvestor({ ...newInvestor, initialInvestment: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profil de risque
                </label>
                <select
                  value={newInvestor.risk}
                  onChange={(e) =>
                    setNewInvestor({ ...newInvestor, risk: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="low">Faible</option>
                  <option value="moderate">Modéré</option>
                  <option value="high">Élevé</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Ajouter l'investisseur
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Responsable</h1>
            <p className="text-gray-400">Gérez vos investisseurs et suivez leurs performances</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 bg-gray-800 p-2 rounded-lg">
          {["dashboard", "investors", "reports", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-yellow-400 text-black"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Contenu principal */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "investors" && renderInvestors()}
        </motion.div>
      </div>

      <AddInvestorModal />
    </div>
  );
};

export default Manager;
