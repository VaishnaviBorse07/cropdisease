// DetectDisease.js
import React, { useState, useEffect, useRef } from "react";
import "./DetectDisease.css";

function DetectDisease() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      // Cleanup camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera by default
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please make sure you have granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob(blob => {
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      processUploadedFile(file);
      stopCamera();
    }, 'image/jpeg');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const processUploadedFile = (file) => {
    // Only process image files
    if (file.type.startsWith("image/")) {
      setImage(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      // Reset result when a new image is uploaded
      setResult(null);
      setError(null);
    } else {
      alert("Please upload an image file (JPEG, PNG, etc.)");
    }
  };

  const handlePrediction = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // For debugging
        setResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to process the image');
        alert(`Error: ${errorData.error || 'Failed to process the image'}`);
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      setError("An error occurred while predicting the disease. Make sure the backend server is running.");
      alert("An error occurred while predicting the disease. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render confidence value safely
  const renderConfidence = (confidence) => {
    if (confidence === undefined || confidence === null) return "N/A";
    if (typeof confidence === 'number') return confidence.toFixed(2) + "%";
    return String(confidence);
  };

  // Helper function to safely render severity details
  const renderSeverity = (severity) => {
    if (!severity || typeof severity !== 'object') return null;
    
    return (
      <div className="severity-section">
        <h4>Disease Severity</h4>
        <p>
          <strong>Severity Level:</strong> {severity.severity_score !== undefined 
            ? `${severity.severity_score}/5 ${severity.stage ? `(${severity.stage})` : ''}`
            : "N/A"}
        </p>
        {severity.description && (
          <p><strong>Description:</strong> {severity.description}</p>
        )}
        {severity.affected_area_percent !== undefined && (
          <p><strong>Affected Area:</strong> {severity.affected_area_percent}%</p>
        )}
        
        {severity.color_metrics && typeof severity.color_metrics === 'object' && (
          <div className="color-metrics">
            <h5>Color Analysis</h5>
            <p>Hue: {severity.color_metrics.mean_hue || "N/A"}</p>
            <p>Saturation: {severity.color_metrics.mean_saturation || "N/A"}</p>
            <p>Value: {severity.color_metrics.mean_value || "N/A"}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="detect-disease">
      <h1>Plant Disease Detection</h1>
      
      <div 
        className={`upload-section ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-prompt">
          <p>Upload a plant leaf image for disease detection</p>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            id="file-upload"
          />
          <label htmlFor="file-upload" className="custom-file-upload">
            {image ? "Change Image" : "Choose Image"}
          </label>
          
          {/* Camera button for mobile */}
          {isMobile && !showCamera && (
            <button onClick={startCamera} className="camera-btn">
              📸 Take Photo
            </button>
          )}
          
          {image && <p className="file-name">{image.name}</p>}
        </div>
        
        <button 
          onClick={handlePrediction} 
          disabled={loading || !image}
          className={loading ? "loading-btn" : ""}
        >
          {loading ? "Analyzing..." : "Detect Disease"}
        </button>
      </div>

      {/* Camera view */}
      {showCamera && (
        <div className="camera-view">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-preview"
          />
          <div className="camera-controls">
            <button onClick={captureImage} className="capture-btn">
              📸 Capture
            </button>
            <button onClick={stopCamera} className="cancel-btn">
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
      
      {previewUrl && (
        <div className="image-preview">
          <h3>Uploaded Image</h3>
          <img src={previewUrl} alt="Plant upload preview" />
        </div>
      )}
      
      {loading && <div className="loading">Analyzing your plant image</div>}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="result">
          <h3>Detection Results</h3>
          
          {/* Display disease name if available */}
          {result.disease && (
            <p><strong>Disease:</strong> {result.disease}</p>
          )}
          
          {/* Safely display confidence value */}
          <p><strong>Confidence:</strong> {renderConfidence(result.confidence)}</p>
          
          {/* Render severity section if available */}
          {renderSeverity(result.severity)}
        </div>
      )}
    </div>
  );
}

export default DetectDisease;
