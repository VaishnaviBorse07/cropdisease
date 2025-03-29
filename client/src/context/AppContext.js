import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const languages = {
  en: {
    home: "Home",
    detect: "Detect Disease",
    about: "About",
    contact: "Contact",
    getStarted: "Get Started",
    welcome: "Welcome to Plant Disease Detection",
    subtitle: "Your AI-powered solution for healthier crops",
    uploadImage: "Upload Image",
    uploadDesc: "Take a clear photo of your plant's leaves or upload an existing image",
    aiAnalysis: "AI Analysis",
    aiDesc: "Our advanced AI model analyzes the image for disease patterns",
    getResults: "Get Results",
    resultsDesc: "Receive detailed diagnosis and treatment recommendations",
    accurateDetection: "Accurate Detection",
    quickResults: "Quick Results",
    detailedAnalysis: "Detailed Analysis",
    startDetection: "Start Detection Now",
    noRegistration: "No registration required • Free to use"
  },
  mr: {
    home: "होम",
    detect: "रोग शोधा",
    about: "आमच्याबद्दल",
    contact: "संपर्क",
    getStarted: "सुरू करा",
    welcome: "वनस्पती रोग शोधण्यासाठी आपले स्वागत आहे",
    subtitle: "आपल्या पिकांसाठी AI-आधारित समाधान",
    uploadImage: "प्रतिमा अपलोड करा",
    uploadDesc: "आपल्या वनस्पतीच्या पानांची स्पष्ट फोटो काढा किंवा विद्यमान प्रतिमा अपलोड करा",
    aiAnalysis: "AI विश्लेषण",
    aiDesc: "आमचा प्रगत AI मॉडेल रोगाच्या नमुन्यांसाठी प्रतिमेचे विश्लेषण करतो",
    getResults: "निकाल मिळवा",
    resultsDesc: "विस्तृत निदान आणि उपचार शिफारसी प्राप्त करा",
    accurateDetection: "अचूक शोधण",
    quickResults: "द्रुत परिणाम",
    detailedAnalysis: "विस्तृत विश्लेषण",
    startDetection: "आता शोधण सुरू करा",
    noRegistration: "नोंदणी आवश्यक नाही • विनामूल्य"
  }
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  return (
    <AppContext.Provider value={{ 
      language, 
      toggleLanguage,
      translations: languages[language]
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
} 