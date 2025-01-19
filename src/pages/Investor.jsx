import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { analyzeInvestment } from '../services/aiService';
import { motion } from "framer-motion";
Chart.register(CategoryScale);

const Investor = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const chatContainerRef = useRef(null);
  const revenueChartRef = useRef(null);
  const profitChartRef = useRef(null);
  const portfolioChartRef = useRef(null);

  // Données enrichies de l'entreprise
  const companyData = {
    revenue: [150000, 180000, 220000, 250000, 280000, 310000],
    expenses: [120000, 140000, 160000, 180000, 200000, 220000],
    profit: [30000, 40000, 60000, 70000, 80000, 90000],
    capital: 500000,
    marketCap: 2000000,
    metrics: {
      peRatio: 15.8,
      debtToEquity: 0.45,
      currentRatio: 2.1,
      quickRatio: 1.8,
      returnOnEquity: 0.18,
      profitMargin: 0.25,
    },
    portfolio: {
      actions: { value: 300000, allocation: 0.4, yield: 0.12 },
      obligations: { value: 150000, allocation: 0.2, yield: 0.05 },
      immobilier: { value: 200000, allocation: 0.25, yield: 0.08 },
      crypto: { value: 50000, allocation: 0.05, yield: 0.25 },
      cash: { value: 100000, allocation: 0.1, yield: 0.02 },
    },
    marketAnalysis: {
      strength: 8,
      opportunities: [
        "Expansion internationale",
        "Nouveaux produits",
        "Acquisitions stratégiques"
      ],
      risks: [
        "Concurrence accrue",
        "Régulations",
        "Volatilité du marché"
      ]
    }
  };

  // Configuration des experts disponibles
  const experts = [
    { id: 1, name: "Sophie Martin", speciality: "Actions", status: "online" },
    { id: 2, name: "Jean Dubois", speciality: "Immobilier", status: "offline" },
    { id: 3, name: "Marie Laurent", speciality: "Crypto", status: "online" },
    { id: 4, name: "Pierre Durand", speciality: "Obligations", status: "online" }
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    // Nettoyage des graphiques existants
    const charts = [revenueChartRef, profitChartRef, portfolioChartRef];
    charts.forEach(chart => {
      if (chart.current) {
        chart.current.destroy();
      }
    });

    // Graphique des revenus et dépenses
    const revenueCtx = document.getElementById("revenueChart")?.getContext("2d");
    if (revenueCtx) {
      revenueChartRef.current = new Chart(revenueCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
          datasets: [
            {
              label: "Revenus",
              data: companyData.revenue,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Dépenses",
              data: companyData.expenses,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "Revenus et Dépenses",
              color: "white"
            },
          },
          scales: {
            y: {
              ticks: { color: "white" },
              grid: { color: "rgba(255,255,255,0.1)" }
            },
            x: {
              ticks: { color: "white" },
              grid: { color: "rgba(255,255,255,0.1)" }
            }
          }
        },
      });
    }

    // Graphique de la répartition du portfolio
    const portfolioCtx = document.getElementById("portfolioChart")?.getContext("2d");
    if (portfolioCtx) {
      portfolioChartRef.current = new Chart(portfolioCtx, {
        type: "doughnut",
        data: {
          labels: Object.keys(companyData.portfolio),
          datasets: [{
            data: Object.values(companyData.portfolio).map(item => item.value),
            backgroundColor: [
              "rgba(75, 192, 192, 0.8)",
              "rgba(255, 99, 132, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(153, 102, 255, 0.8)",
              "rgba(54, 162, 235, 0.8)",
            ],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "right",
              labels: { color: "white" }
            },
            title: {
              display: true,
              text: "Répartition du Portfolio",
              color: "white"
            },
          },
        },
      });
    }

    return () => {
      charts.forEach(chart => {
        if (chart.current) {
          chart.current.destroy();
        }
      });
    };
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    const userMessage = message;
    setMessage("");

    setChatHistory(prev => [...prev, { 
      role: "user", 
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    try {
      const aiResponse = await analyzeInvestment(userMessage, companyData);
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: aiResponse,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error("Erreur d'analyse:", error);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cartes de statistiques */}
              <motion.div 
                className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-gray-400 text-sm font-medium">Capital Total</h3>
                <p className="text-2xl font-bold text-yellow-400">{companyData.capital.toLocaleString()}€</p>
                <div className="mt-2 flex items-center text-sm text-green-400">
                  <span>↑ 12%</span>
                  <span className="ml-2 text-gray-400">vs mois dernier</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-gray-400 text-sm font-medium">Performance YTD</h3>
                <p className="text-2xl font-bold text-yellow-400">+15.8%</p>
                <div className="mt-2 flex items-center text-sm text-green-400">
                  <span>↑ 2.3%</span>
                  <span className="ml-2 text-gray-400">ce mois</span>
                </div>
              </motion.div>

              <motion.div 
                className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-gray-400 text-sm font-medium">Rendement Moyen</h3>
                <p className="text-2xl font-bold text-yellow-400">8.5%</p>
                <div className="mt-2 flex items-center text-sm text-green-400">
                  <span>↑ 0.5%</span>
                  <span className="ml-2 text-gray-400">vs objectif</span>
                </div>
              </motion.div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <canvas id="revenueChart"></canvas>
              </div>
              <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <canvas id="portfolioChart"></canvas>
              </div>
            </div>
          </div>
        );

      case "investments":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Types d'investissements */}
            <motion.div 
              className="bg-gray-800 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Actions</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Allocation</span>
                  <span className="text-yellow-400">{(companyData.portfolio.actions.allocation * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rendement</span>
                  <span className="text-green-400">{(companyData.portfolio.actions.yield * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Valeur</span>
                  <span className="text-yellow-400">{companyData.portfolio.actions.value.toLocaleString()}€</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-800 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Obligations</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Allocation</span>
                  <span className="text-yellow-400">{(companyData.portfolio.obligations.allocation * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rendement</span>
                  <span className="text-green-400">{(companyData.portfolio.obligations.yield * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Valeur</span>
                  <span className="text-yellow-400">{companyData.portfolio.obligations.value.toLocaleString()}€</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-800 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Immobilier</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Allocation</span>
                  <span className="text-yellow-400">{(companyData.portfolio.immobilier.allocation * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rendement</span>
                  <span className="text-green-400">{(companyData.portfolio.immobilier.yield * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Valeur</span>
                  <span className="text-yellow-400">{companyData.portfolio.immobilier.value.toLocaleString()}€</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-800 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Crypto</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Allocation</span>
                  <span className="text-yellow-400">{(companyData.portfolio.crypto.allocation * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rendement</span>
                  <span className="text-green-400">{(companyData.portfolio.crypto.yield * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Valeur</span>
                  <span className="text-yellow-400">{companyData.portfolio.crypto.value.toLocaleString()}€</span>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case "chat":
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Liste des experts */}
            <div className="md:col-span-1 bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Experts</h3>
              <div className="space-y-4">
                {experts.map(expert => (
                  <motion.div 
                    key={expert.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-3 h-3 rounded-full ${expert.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <div>
                      <p className="text-white font-medium">{expert.name}</p>
                      <p className="text-sm text-gray-400">{expert.speciality}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Zone de chat */}
            <div className="md:col-span-3 bg-gray-800 rounded-xl shadow-lg p-6">
              <div 
                ref={chatContainerRef}
                className="h-[400px] overflow-y-auto mb-4 space-y-4"
              >
                {chatHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      msg.role === 'user' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'
                    }`}>
                      <p>{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-white rounded-lg p-3">
                      <p>En train d'écrire...</p>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Posez votre question..."
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  Envoyer
                </button>
              </form>
              {error && (
                <p className="text-red-400 mt-2">{error}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-indigo-950">
      {/* Header */}
      <motion.div 
        className="bg-opacity-20 backdrop-blur-lg py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-yellow-400">
            Dashboard Investisseur
          </h1>
          <p className="text-gray-300 text-lg">
            Analysez vos investissements et optimisez votre portfolio
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-yellow-400 text-black"
                : "text-gray-400 hover:text-yellow-400"
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab("investments")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "investments"
                ? "bg-yellow-400 text-black"
                : "text-gray-400 hover:text-yellow-400"
            }`}
          >
            Investissements
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "chat"
                ? "bg-yellow-400 text-black"
                : "text-gray-400 hover:text-yellow-400"
            }`}
          >
            Chat Expert
          </button>
        </div>

        {/* Contenu principal */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-6"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Investor;
