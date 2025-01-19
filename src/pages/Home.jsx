import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon, ChartBarIcon, LockClosedIcon } from "@heroicons/react/solid";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-indigo-950 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 bg-opacity-20 backdrop-blur-lg">
        <motion.h1
          className="text-4xl font-extrabold tracking-widest text-yellow-400"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          InvestAI Elite
        </motion.h1>
        <nav className="flex space-x-8">
          <Link
            to="/signup"
            className="hover:text-yellow-300 transition text-lg font-medium"
          >
            S'inscrire
          </Link>
          <Link
            to="/signin"
            className="hover:text-yellow-300 transition text-lg font-medium"
          >
            Se connecter
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-between px-10 py-20">
        {/* Text Content */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            Gérez vos <span className="text-yellow-300">investissements</span> <br />
            avec une précision <span className="text-yellow-300">AI</span>.
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Maximisez vos rendements financiers grâce à des outils d'analyse
            prédictive, une visualisation avancée et des décisions basées sur
            l'IA.
          </p>
          <div className="flex space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition"
              >
                Commencez Maintenant
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <a
                href="#features"
                className="px-8 py-4 border border-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition"
              >
                Découvrir Plus
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* GIF Animation */}
        <motion.div
          className="lg:w-1/2 mt-10 lg:mt-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="/src/assets/2.gif"
            alt="Hero Animation"
            className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
          />
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            className="text-5xl font-extrabold mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Pourquoi <span className="text-yellow-400">InvestAI</span> ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <ChartBarIcon className="h-12 w-12 text-yellow-400 mb-4" />,
                title: "Analyse Prédictive",
                description:
                  "Anticipez les tendances du marché avec des algorithmes puissants et des données en temps réel.",
              },
              {
                icon: <LockClosedIcon className="h-12 w-12 text-yellow-400 mb-4" />,
                title: "Sécurité Avancée",
                description:
                  "Vos données et transactions sont protégées par des technologies de chiffrement de pointe.",
              },
              {
                icon: <ArrowRightIcon className="h-12 w-12 text-yellow-400 mb-4" />,
                title: "Décisions Rapides",
                description:
                  "Prenez des décisions éclairées grâce à des rapports générés instantanément.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-2xl transition"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
                <h3 className="text-2xl font-bold mb-4 text-yellow-300">
                  {feature.title}
                </h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-purple-800 text-center text-white">
        <motion.h2
          className="text-5xl font-extrabold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Transformez vos finances avec <span className="text-yellow-400">InvestAI</span>.
        </motion.h2>
        <motion.p
          className="mb-10 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Rejoignez une communauté d’investisseurs qui utilisent la technologie pour réussir.
        </motion.p>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/signup"
            className="px-10 py-4 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Rejoignez-nous Maintenant
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2025 InvestAI. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
