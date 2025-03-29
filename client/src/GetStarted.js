import React from "react";
import { Link } from "react-router-dom";
import "./GetStarted.css";

function GetStarted() {
  return (
    <div className="get-started">
      <div className="get-started-content">
        <h1>Welcome to Plant Disease Detection</h1>
        <p className="subtitle">Your AI-powered solution for healthier crops</p>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Image</h3>
            <p>Take a clear photo of your plant's leaves or upload an existing image</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our advanced AI model analyzes the image for disease patterns</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Results</h3>
            <p>Receive detailed diagnosis and treatment recommendations</p>
          </div>
        </div>

        <div className="features-highlight">
          <div className="feature">
            <span className="feature-icon">🔍</span>
            <p>Accurate Detection</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <p>Quick Results</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <p>Detailed Analysis</p>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/detect" className="start-button">
            Start Detection Now
          </Link>
          <p className="cta-subtext">No registration required • Free to use</p>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;