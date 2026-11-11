
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

# Check input argument
if len(sys.argv) < 2:
    print("Usage: python scripts/predict.py <image_path>")
    sys.exit(1)

IMAGE_PATH = Path(sys.argv[1])

if not IMAGE_PATH.exists():
    print("Image not found:", IMAGE_PATH)
    sys.exit(1)

# Load class names
with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)

# Load trained model
print("Loading EcoLoop AI model...")

model = tf.keras.models.load_model(MODEL_PATH)

# Load and preprocess image
image = Image.open(IMAGE_PATH).convert("RGB")
image = image.resize(IMG_SIZE, Image.Resampling.BILINEAR)

image_array = np.array(image, dtype=np.float32)
image_array = np.expand_dims(image_array, axis=0)

# Predict
predictions = model.predict(image_array, verbose=0)[0]

# Get top predictions
top_indices = np.argsort(predictions)[::-1][:3]

print("\n========== ECOLOOP AI PREDICTION ==========\n")

for rank, index in enumerate(top_indices, start=1):
    print(
        f"{rank}. {class_names[index]}: "
        f"{predictions[index] * 100:.2f}%"
    )

best_index = int(np.argmax(predictions))

print("\nDetected category:", class_names[best_index])
print(
    "Confidence:",
    f"{predictions[best_index] * 100:.2f}%"
)

print("\n==========================================")
