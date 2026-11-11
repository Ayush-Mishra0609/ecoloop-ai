
from pathlib import Path
import json
import tensorflow as tf

# Project paths
ML_DIR = Path(__file__).resolve().parents[1]
DATASET_DIR = ML_DIR / "datasets" / "E-Tadweer Image Dataset (ETID)"
MODEL_DIR = ML_DIR / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

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

class_names = train_ds.class_names
num_classes = len(class_names)

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

class_weights = {
    i: total / (num_classes * count)
    for i, count in enumerate(counts)
}

# Optimize dataset loading
AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)

# Data augmentation
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
])

# Load pretrained MobileNetV2
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

# Freeze pretrained layers
base_model.trainable = False

# Build classification model
inputs = tf.keras.Input(shape=(224, 224, 3))

x = data_augmentation(inputs)
x = tf.keras.layers.Rescaling(1.0 / 127.5, offset=-1)(x)

x = base_model(x, training=False)
x = tf.keras.layers.GlobalAveragePooling2D()(x)

x = tf.keras.layers.Dropout(0.3)(x)

outputs = tf.keras.layers.Dense(
    num_classes,
    activation="softmax"
)(x)

model = tf.keras.Model(inputs, outputs)

# Compile
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# Save class names
with open(MODEL_DIR / "class_names.json", "w") as f:
    json.dump(class_names, f, indent=4)

# Callbacks
callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True
    ),
    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(MODEL_DIR / "mobilenetv2_best.keras"),
        monitor="val_loss",
        save_best_only=True
    )
]

# Train
print("\nStarting MobileNetV2 training...\n")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=callbacks
)

print("\nTraining completed!")

print("Best model saved at:", MODEL_DIR / "mobilenetv2_best.keras")
