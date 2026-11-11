
from pathlib import Path
import tensorflow as tf

# Dataset location
ML_DIR = Path(__file__).resolve().parents[1]

DATASET_DIR = (
    ML_DIR / "datasets" / "E-Tadweer Image Dataset (ETID)"
)

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42

# Load training dataset
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=SEED,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

# Load validation dataset
val_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=SEED,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names

print("\n========== DATASET PREPARATION ==========")
print("Classes:", class_names)
print("Number of classes:", len(class_names))
print("Training batches:", len(train_ds))
print("Validation batches:", len(val_ds))

# Calculate class weights
counts = []

for class_name in class_names:
    class_dir = DATASET_DIR / class_name

    count = sum(
        1 for p in class_dir.rglob("*")
        if p.is_file() and p.suffix.lower()
        in {".jpg", ".jpeg", ".png", ".webp"}
    )

    counts.append(count)

total = sum(counts)
num_classes = len(class_names)

class_weights = {
    i: total / (num_classes * count)
    for i, count in enumerate(counts)
}

print("\nClass weights:")
for i, name in enumerate(class_names):
    print(f"{name}: {class_weights[i]:.3f}")

print("\nDataset preparation completed!")
print("========================================")

# Optimize data loading
AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)
