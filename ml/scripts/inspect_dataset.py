
from pathlib import Path
from PIL import Image

# Locate the ML project directory
ML_DIR = Path(__file__).resolve().parents[1]

# Actual dataset folder name
DATASET_DIR = ML_DIR / "datasets" / "E-Tadweer Image Dataset (ETID)"

valid_extensions = {".jpg", ".jpeg", ".png", ".webp"}

print("\n========== DATASET INSPECTION ==========\n")

if not DATASET_DIR.exists():
    print("Dataset folder not found!")
    print("Expected:", DATASET_DIR)
    raise SystemExit

total_images = 0
total_corrupted = 0

for category in sorted(DATASET_DIR.iterdir()):
    if not category.is_dir():
        continue

    images = [
        p for p in category.rglob("*")
        if p.is_file() and p.suffix.lower() in valid_extensions
    ]

    valid = 0
    corrupted = 0

    for image_path in images:
        try:
            with Image.open(image_path) as img:
                img.verify()
            valid += 1
        except Exception:
            corrupted += 1

    total_images += valid
    total_corrupted += corrupted

    print(f"\n{category.name}")
    print(f"  Valid images: {valid}")
    print(f"  Corrupted images: {corrupted}")

print("\n========================================")
print("Total valid images:", total_images)
print("Total corrupted images:", total_corrupted)
print("========================================")
