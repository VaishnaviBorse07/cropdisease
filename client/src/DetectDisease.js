import React, { useState, useEffect } from "react";
import "./DetectDisease.css";

function DetectDisease() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await fetch("https://cropdisease-app.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        setResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to process the image");
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

  const renderConfidence = (confidence) => {
    if (confidence === undefined || confidence === null) return "N/A";
    return typeof confidence === 'number' ? confidence.toFixed(2) + "%" : String(confidence);
  };

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
        {severity.description && <p><strong>Description:</strong> {severity.description}</p>}
        {severity.affected_area_percent !== undefined && <p><strong>Affected Area:</strong> {severity.affected_area_percent}%</p>}
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
      <div className={`upload-section ${dragActive ? "drag-active" : ""}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <div className="upload-prompt">
          <p>Upload a plant leaf image for disease detection</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} id="file-upload" />
          <label htmlFor="file-upload" className="custom-file-upload">
            {image ? "Change Image" : "Choose Image"}
          </label>
          {image && <p className="file-name">{image.name}</p>}
        </div>
        <button onClick={handlePrediction} disabled={loading || !image} className={loading ? "loading-btn" : ""}>
          {loading ? "Analyzing..." : "Detect Disease"}
        </button>
      </div>
      {previewUrl && <div className="image-preview"><h3>Uploaded Image</h3><img src={previewUrl} alt="Plant upload preview" /></div>}
      {loading && <div className="loading">Analyzing your plant image</div>}
      {error && <div className="error-message"><p>{error}</p></div>}
      {result && <div className="result"><h3>Detection Results</h3>{result.disease && <p><strong>Disease:</strong> {result.disease}</p>}<p><strong>Confidence:</strong> {renderConfidence(result.confidence)}</p>{renderSeverity(result.severity)}</div>}
    </div>
  );
}

export default DetectDisease;

