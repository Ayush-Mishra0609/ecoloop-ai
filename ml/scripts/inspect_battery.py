
from pathlib import Path
from PIL import Image
from collections import Counter

ML_DIR = Path(__file__).resolve().parents[1]

BATTERY_DIR = (
    ML_DIR / "datasets" / "ecoloop_split" / "train" / "Battery"
)

image_extensions = {".jpg", ".jpeg", ".png", ".webp"}

shape_counts = Counter()
aspect_ratios = []

for image_path in BATTERY_DIR.rglob("*"):
    if image_path.suffix.lower() not in image_extensions:
        continue

    try:
        with Image.open(image_path) as img:
            width, height = img.size

            shape_counts[(width, height)] += 1
            aspect_ratios.append(round(width / height, 2))

    except Exception as e:
        print("Could not read:", image_path.name, e)

print("\n========== BATTERY DATASET INSPECTION ==========")

print("Total images:", len(aspect_ratios))

print("\nMost common image dimensions:")

for dimensions, count in shape_counts.most_common(10):
    print(dimensions, ":", count)

print("\nAspect ratio statistics:")

if aspect_ratios:
    print("Minimum:", min(aspect_ratios))
    print("Maximum:", max(aspect_ratios))
    print("Average:", round(sum(aspect_ratios) / len(aspect_ratios), 3))

print("\n================================================")
