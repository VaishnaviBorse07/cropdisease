import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from "react-router-dom";
import Home from "./Home";
import GetStarted from "./GetStarted";
import DetectDisease from "./DetectDisease";
import About from "./About";
import Contact from "./Contact";
import Settings from "./components/Settings";
import { AppProvider, useApp } from "./context/AppContext";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/getstarted";
  const { translations } = useApp();

  return (
    <div className="app">
      {showNavbar && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">PlantDisease</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">{translations.home}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/detect">{translations.detect}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">{translations.about}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">{translations.contact}</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      <Settings />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detect" element={<DetectDisease />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/getstarted" element={<GetStarted />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
