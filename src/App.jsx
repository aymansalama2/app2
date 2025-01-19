import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Admin from "./pages/Admin";
import Investor from "./pages/Investor";
import Manager from "./pages/Manager";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/investissement" element={<Investor />} />
          <Route path="/manager" element={<Manager />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
