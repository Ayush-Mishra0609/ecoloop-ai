
from pathlib import Path
import json
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

# Paths
ML_DIR = Path(__file__).resolve().parents[1]

DATASET_DIR = (
    ML_DIR / "datasets" / "E-Tadweer Image Dataset (ETID)"
)

MODEL_PATH = ML_DIR / "models" / "mobilenetv2_finetuned_best.keras"
# Configuration
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42

# Load class names
with open(ML_DIR / "models" / "class_names.json") as f:
    class_names = json.load(f)

# Load the same shuffled validation split used during training
val_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=SEED,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True
)

# Load trained model
model = tf.keras.models.load_model(MODEL_PATH)

# IMPORTANT: Collect labels and predictions in ONE pass
y_true = []
y_pred = []

for images, labels in val_ds:
    predictions = model(images, training=False)

    predicted_classes = tf.argmax(
        predictions, axis=1
    ).numpy()

    y_true.extend(labels.numpy())
    y_pred.extend(predicted_classes)

y_true = np.array(y_true)
y_pred = np.array(y_pred)

# Classification report
print("\n========== CLASSIFICATION REPORT ==========\n")

print(classification_report(
    y_true,
    y_pred,
    labels=range(len(class_names)),
    target_names=class_names,
    digits=4,
    zero_division=0
))

# Confusion matrix
cm = confusion_matrix(
    y_true,
    y_pred,
    labels=range(len(class_names))
)

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=class_names
)

fig, ax = plt.subplots(figsize=(10, 8))

display.plot(
    cmap="Blues",
    xticks_rotation=45,
    ax=ax,
    colorbar=False
)

plt.title("EcoLoop AI - MobileNetV2 Confusion Matrix")
plt.tight_layout()

output_path = ML_DIR / "models" / "confusion_matrix.png"

plt.savefig(output_path, dpi=300)
plt.show()

print("\nTotal evaluated images:", len(y_true))
print("Confusion matrix saved at:", output_path)
