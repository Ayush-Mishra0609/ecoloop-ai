
from pathlib import Path
import json

import numpy as np
import tensorflow as tf
from PIL import Image
from io import BytesIO


# Project directory
PROJECT_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = (
    PROJECT_DIR / "ml" / "models" /
    "mobilenetv2_final_finetuned.keras"
)

CLASS_PATH = (
    PROJECT_DIR / "ml" / "models" /
    "class_names_final.json"
)

IMG_SIZE = (224, 224)


class DevicePredictionService:

    def __init__(self):
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found: {MODEL_PATH}"
            )

        if not CLASS_PATH.exists():
            raise FileNotFoundError(
                f"Class names file not found: {CLASS_PATH}"
            )

        print("Loading EcoLoop AI MobileNetV2 model...")

        self.model = tf.keras.models.load_model(MODEL_PATH)

        with open(CLASS_PATH, "r") as f:
            self.class_names = json.load(f)

        print("EcoLoop AI model loaded successfully!")

    def predict(self, image_data: bytes):

        # Open uploaded image
        image = Image.open(
            BytesIO(image_data)
        ).convert("RGB")

        # Resize image exactly as in standalone prediction
        image = image.resize(
            IMG_SIZE,
            Image.Resampling.BILINEAR
        )

        # Convert to NumPy array
        image_array = np.array(
            image,
            dtype=np.float32
        )

        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # Run model prediction
        predictions = self.model.predict(
            image_array,
            verbose=0
        )[0]

        # Get top 3 predictions
        top_indices = np.argsort(predictions)[::-1][:3]

        best_index = int(np.argmax(predictions))

        return {
            "category": self.class_names[best_index],
            "confidence": float(predictions[best_index]),
            "top_predictions": [
                {
                    "category": self.class_names[int(index)],
                    "confidence": float(predictions[index])
                }
                for index in top_indices
            ]
        }
