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
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow camera permission.");
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
    setDragActive(e.type === "dragenter" || e.type === "dragover");
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
    if (file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    } else {
      alert("Please upload an image file.");
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
      const response = await fetch("https://cropdisease-app.onrender.com/predict", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      setResult(data);
    } catch (error) {
      console.error("Prediction error:", error);
      setError("An error occurred. Please make sure the backend server is running.");
      alert("An error occurred while predicting. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const renderConfidence = (confidence) => {
    if (confidence === undefined || confidence === null) return "N/A";
    return typeof confidence === 'number' ? `${confidence.toFixed(2)}%` : String(confidence);
  };

  const renderSeverity = (severity) => {
    if (!severity || typeof severity !== 'object') return null;

    return (
      <div className="severity-section">
        <h4>Disease Severity</h4>
        <p>
          <strong>Severity Level:</strong>{" "}
          {severity.severity_score !== undefined
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
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      {loading && <div className="loading">Analyzing your plant image...</div>}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result">
          <h3>Detection Results</h3>
          {result.disease && <p><strong>Disease:</strong> {result.disease}</p>}
          <p><strong>Confidence:</strong> {renderConfidence(result.confidence)}</p>
          {renderSeverity(result.severity)}
        </div>
      )}
    </div>
  );
}

export default DetectDisease;


