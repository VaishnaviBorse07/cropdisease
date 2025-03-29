import requests
import json
import os

def test_predict_endpoint():
    # Path to a test image
    test_image_path = "../PlantVillage_subset_1/PlantVillage_subset/val/Tomato___Early_blight/0ecc2ee7-fb66-41fa-a23b-9bdeaf31078a___RS_Erly.B 6381.JPG"
    
    if not os.path.exists(test_image_path):
        print(f"Test image not found at: {test_image_path}")
        return
    
    # Send image to the predict endpoint
    url = "http://localhost:5000/predict"
    
    with open(test_image_path, "rb") as img_file:
        files = {"image": img_file}
        response = requests.post(url, files=files)
    
    if response.status_code == 200:
        # Parse and display the response
        result = response.json()
        print(json.dumps(result, indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_predict_endpoint() 