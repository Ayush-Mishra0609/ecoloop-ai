
from pathlib import Path
import sys
import json
import numpy as np
import tensorflow as tf

from PIL import Image

# Project paths
ML_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = ML_DIR / "models" / "mobilenetv2_final_finetuned.keras"
CLASS_PATH = ML_DIR / "models" / "class_names_final.json"

IMG_SIZE = (224, 224)

def load_model():
    print("Loading EcoLoop AI model...")
    return tf.keras.models.load_model(MODEL_PATH)


def predict_device(image_path, model):
    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    # Load class names
    with open(CLASS_PATH, "r") as f:
        class_names = json.load(f)

    # Load image
    image = Image.open(image_path).convert("RGB")

    # Resize image
    image = image.resize(
        IMG_SIZE,
        Image.Resampling.BILINEAR
    )

    # Convert to NumPy array
    image_array = np.array(image, dtype=np.float32)

    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)

    # Predict
    predictions = model.predict(image_array, verbose=0)[0]

    # Top 3 predictions
    top_indices = np.argsort(predictions)[::-1][:3]

    print("\n========== ECOLOOP AI PREDICTION ==========\n")

    for rank, index in enumerate(top_indices, start=1):
        print(
            f"{rank}. {class_names[index]}: "
            f"{predictions[index] * 100:.2f}%"
        )

    best_index = int(np.argmax(predictions))

    result = {
        "category": class_names[best_index],
        "confidence": float(predictions[best_index]),
        "top_predictions": [
            {
                "category": class_names[int(i)],
                "confidence": float(predictions[i])
            }
            for i in top_indices
        ]
    }

    print("\nDetected category:", result["category"])
    print("Confidence:", f"{result['confidence'] * 100:.2f}%")
    print("\n==========================================")

    return result


if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Usage: python scripts/predict.py <image_path>")
        sys.exit(1)

    model = load_model()

    predict_device(sys.argv[1], model)
