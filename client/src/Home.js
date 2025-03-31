import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "./context/AppContext";
import "./Home.css";

function Home() {
  const { translations } = useApp();

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>{translations.welcome}</h1>
          <p>{translations.subtitle}</p>
          <div className="cta-buttons">
            <Link to="/detect" className="primary-btn">{translations.startDetection}</Link>
            <Link to="/about" className="secondary-btn">{translations.about}</Link>
          </div>
        </div>
      </div>

      <div className="features-overview">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>{translations.accurateDetection}</h3>
          <p>{translations.aiDesc}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>{translations.quickResults}</h3>
          <p>{translations.resultsDesc}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>{translations.detailedAnalysis}</h3>
          <p>{translations.aiDesc}</p>
        </div>
      </div>

      <div className="info-section">
        <div className="info-content">
          <h2>{translations.welcome}</h2>
          <p>{translations.aiDesc}</p>
          <Link to="/getstarted" className="text-link">{translations.getStarted} →</Link>
        </div>
        <div className="info-image">
          {/* This div will have a background image via CSS */}
        </div>
      </div>
    </div>
  );
}

export default Home;
