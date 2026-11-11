
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

ML_DIR = Path(__file__).resolve().parents[1]

TEST_DIR = ML_DIR / "datasets" / "ecoloop_split" / "test"

MODEL_PATH = (
    ML_DIR / "models" / "mobilenetv2_final_finetuned.keras"
)

CLASS_PATH = ML_DIR / "models" / "class_names_final.json"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

# Load class names
with open(CLASS_PATH) as f:
    class_names = json.load(f)

# Load untouched test dataset
test_ds = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

assert test_ds.class_names == class_names

# Load selected model
model = tf.keras.models.load_model(MODEL_PATH)

print("\nEvaluating final model on independent test data...\n")

# Evaluate loss and accuracy
loss, accuracy = model.evaluate(test_ds, verbose=1)

# Collect predictions
y_true = []
y_pred = []

for images, labels in test_ds:
    predictions = model(images, training=False)

    predicted_classes = tf.argmax(
        predictions, axis=1
    ).numpy()

    y_true.extend(labels.numpy())
    y_pred.extend(predicted_classes)

y_true = np.array(y_true)
y_pred = np.array(y_pred)

# Classification report
print("\n========== FINAL TEST REPORT ==========\n")

print(classification_report(
    y_true,
    y_pred,
    labels=range(len(class_names)),
    target_names=class_names,
    digits=4,
    zero_division=0
))

print("Test accuracy:", round(accuracy * 100, 2), "%")
print("Test loss:", round(loss, 4))
print("Total test images:", len(y_true))

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

plt.title("EcoLoop AI - Final Test Confusion Matrix")
plt.tight_layout()

OUTPUT_PATH = MODEL_DIR = ML_DIR / "models" / "final_test_confusion_matrix.png"

plt.savefig(OUTPUT_PATH, dpi=300)
plt.show()

print("\nConfusion matrix saved:", OUTPUT_PATH)
