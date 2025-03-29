import React from 'react';
import { useApp } from '../context/AppContext';
import './Settings.css';

function Settings() {
  const { language, toggleLanguage } = useApp();

  return (
    <div className="settings-container">
      <button 
        className="settings-btn language-btn"
        onClick={toggleLanguage}
        title={language === 'en' ? 'मराठी मध्ये बदला' : 'Switch to English'}
      >
        {language === 'en' ? 'MR' : 'EN'}
      </button>
    </div>
  );
}

export default Settings; 