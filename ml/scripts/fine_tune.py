
from pathlib import Path
import tensorflow as tf

# Project paths
ML_DIR = Path(__file__).resolve().parents[1]

DATASET_DIR = (
    ML_DIR / "datasets" / "E-Tadweer Image Dataset (ETID)"
)

MODEL_DIR = ML_DIR / "models"

BASELINE_MODEL = MODEL_DIR / "mobilenetv2_best.keras"
FINETUNED_MODEL = MODEL_DIR / "mobilenetv2_finetuned_best.keras"

# Configuration
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42
EPOCHS = 10

# Load datasets
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=SEED,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=SEED,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

# Calculate class weights
class_names = train_ds.class_names
num_classes = len(class_names)

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

class_weights = {
    i: total / (num_classes * count)
    for i, count in enumerate(counts)
}

# Optimize loading
AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)

# Load our previously trained model
print("\nLoading baseline MobileNetV2 model...")

model = tf.keras.models.load_model(BASELINE_MODEL)

# Locate pretrained MobileNetV2 base model
base_model = model.get_layer("mobilenetv2_1.00_224")

# Unfreeze the base model
base_model.trainable = True

# Keep only the last 30 layers trainable
for layer in base_model.layers[:-30]:
    layer.trainable = False

# Keep Batch Normalization layers frozen
for layer in base_model.layers:
    if isinstance(layer, tf.keras.layers.BatchNormalization):
        layer.trainable = False

print("MobileNetV2 fine-tuning configuration:")
print("Total base layers:", len(base_model.layers))
print(
    "Trainable base layers:",
    sum(1 for layer in base_model.layers if layer.trainable)
)

# Recompile with a low learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.00001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# Callbacks
callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True
    ),

    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(FINETUNED_MODEL),
        monitor="val_loss",
        save_best_only=True
    ),

    tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.2,
        patience=2,
        min_lr=1e-7
    )
]

# Fine-tune model
print("\nStarting MobileNetV2 fine-tuning...\n")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=callbacks
)

print("\nFine-tuning completed!")
print("Fine-tuned model:", FINETUNED_MODEL)
