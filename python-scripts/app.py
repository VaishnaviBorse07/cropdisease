from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import traceback
from quick_predict import predict_disease_with_stage

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("crop-disease-api")

app = Flask(__name__)
CORS(app,origins="https://cropdisease-frontend.onrender.com")  # Enable CORS to allow communication with the React frontend

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create the uploads folder if it doesn't exist
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/", methods=["GET"])
def index():
    logger.info("Root endpoint accessed")
    return jsonify({
        "message": "Crop Disease Prediction API",
        "usage": {
            "endpoint": "/predict",
            "method": "POST",
            "body": "form-data with 'image' file"
        }
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        logger.info("Prediction endpoint accessed")
        
        if "image" not in request.files:
            logger.warning("No image file provided")
            return jsonify({"error": "No image file provided"}), 400

        file = request.files["image"]
        if file.filename == "":
            logger.warning("Empty filename provided")
            return jsonify({"error": "No selected file"}), 400

        # Save the uploaded image
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)
        logger.info(f"Image saved to {file_path}")

        # Run the prediction
        try:
            logger.info("Running prediction")
            disease_name, confidence, severity_analysis = predict_disease_with_stage(file_path, show_plots=False)
            
            if disease_name is None:
                logger.error("Prediction failed, no disease name returned")
                return jsonify({"error": "Failed to predict disease"}), 500
            
            # Format the response
            prediction = {
                "disease": disease_name,
                "confidence": confidence,
                "severity": severity_analysis
            }
            
            logger.info(f"Prediction successful: {disease_name} with {confidence:.2f}% confidence")
            return jsonify(prediction)
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({"error": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    logger.info("Health check endpoint accessed")
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    logger.info("Starting server on port 10000")
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 10000)))
