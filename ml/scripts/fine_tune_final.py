
from pathlib import Path
import tensorflow as tf

ML_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = ML_DIR / "datasets" / "ecoloop_split"
MODEL_DIR = ML_DIR / "models"

BASELINE_MODEL = MODEL_DIR / "mobilenetv2_final.keras"
OUTPUT_MODEL = MODEL_DIR / "mobilenetv2_final_finetuned.keras"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
SEED = 42

# Load training dataset
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "train",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    seed=SEED,
    shuffle=True
)

# Load validation dataset
val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "validation",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

class_names = train_ds.class_names
assert class_names == val_ds.class_names

# Calculate class weights
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
    i: total / (len(class_names) * count)
    for i, count in enumerate(counts)
}

# Optimize loading
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)

# Load the new baseline model
print("\nLoading new baseline model...")
model = tf.keras.models.load_model(BASELINE_MODEL)

# Unfreeze MobileNetV2
base_model = model.get_layer("mobilenetv2_1.00_224")
base_model.trainable = True

# Freeze all but the last 30 layers
for layer in base_model.layers[:-30]:
    layer.trainable = False

# Keep Batch Normalization frozen
for layer in base_model.layers:
    if isinstance(layer, tf.keras.layers.BatchNormalization):
        layer.trainable = False

print(
    "Trainable base layers:",
    sum(layer.trainable for layer in base_model.layers)
)

# Recompile with a low learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.00001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True
    ),

    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(OUTPUT_MODEL),
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

print("\nStarting final model fine-tuning...\n")

model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=callbacks
)

print("\nFine-tuning completed!")
print("Saved model:", OUTPUT_MODEL)
