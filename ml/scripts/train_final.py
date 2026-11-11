
from pathlib import Path
import json
import tensorflow as tf

ML_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = ML_DIR / "datasets" / "ecoloop_split"
MODEL_DIR = ML_DIR / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42
EPOCHS = 10

# Load training data
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "train",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    seed=SEED,
    shuffle=True
)

# Load validation data
val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "validation",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

class_names = train_ds.class_names
num_classes = len(class_names)

assert class_names == val_ds.class_names

print("Classes:", class_names)

# Calculate class weights from training data
counts = []

for name in class_names:
    folder = DATA_DIR / "train" / name

    count = sum(
        1 for p in folder.rglob("*")
        if p.is_file() and p.suffix.lower()
        in {".jpg", ".jpeg", ".png", ".webp"}
    )

    counts.append(count)

total = sum(counts)

class_weights = {
    i: total / (num_classes * count)
    for i, count in enumerate(counts)
}

print("\nClass weights:")
for i, name in enumerate(class_names):
    print(name, round(class_weights[i], 3))

# Optimize data loading
AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)

# Data augmentation
augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1)
])

# Load MobileNetV2
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False

# Build classifier
inputs = tf.keras.Input(shape=(224, 224, 3))

x = augmentation(inputs)
x = tf.keras.layers.Rescaling(
    1.0 / 127.5,
    offset=-1
)(x)

x = base_model(x, training=False)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.3)(x)

outputs = tf.keras.layers.Dense(
    num_classes,
    activation="softmax"
)(x)

model = tf.keras.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# Save class names
with open(MODEL_DIR / "class_names_final.json", "w") as f:
    json.dump(class_names, f, indent=4)

# Callbacks
callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True
    ),

    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(MODEL_DIR / "mobilenetv2_final.keras"),
        monitor="val_loss",
        save_best_only=True
    )
]

# Train
print("\nStarting final training...\n")

model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=callbacks
)

print("\nFinal training completed!")
print("Model:", MODEL_DIR / "mobilenetv2_final.keras")
