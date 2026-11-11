import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2

print("TensorFlow version:", tf.__version__)

model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

print("MobileNetV2 loaded successfully!")
print("Total parameters:", model.count_params())