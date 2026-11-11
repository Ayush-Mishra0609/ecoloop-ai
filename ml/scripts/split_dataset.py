
from pathlib import Path
from sklearn.model_selection import train_test_split
import shutil
import random

ML_DIR = Path(__file__).resolve().parents[1]

SOURCE_DIR = ML_DIR / "datasets" / "E-Tadweer Image Dataset (ETID)"
OUTPUT_DIR = ML_DIR / "datasets" / "ecoloop_split"

SEED = 42
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

random.seed(SEED)

if OUTPUT_DIR.exists():
    raise SystemExit(
        "Output folder already exists. Stop to avoid overwriting data."
    )

OUTPUT_DIR.mkdir(parents=True)

print("\nPreparing stratified dataset split...\n")

all_images = []
all_labels = []

for category_dir in sorted(SOURCE_DIR.iterdir()):
    if not category_dir.is_dir():
        continue

    images = [
        p for p in category_dir.rglob("*")
        if p.is_file() and p.suffix.lower() in EXTENSIONS
    ]

    for image in images:
        all_images.append(image)
        all_labels.append(category_dir.name)

# First split: 70% training, 30% temporary
train_images, temp_images, train_labels, temp_labels = (
    train_test_split(
        all_images,
        all_labels,
        test_size=0.30,
        random_state=SEED,
        stratify=all_labels
    )
)

# Second split: 15% validation, 15% testing
val_images, test_images, val_labels, test_labels = (
    train_test_split(
        temp_images,
        temp_labels,
        test_size=0.50,
        random_state=SEED,
        stratify=temp_labels
    )
)

splits = {
    "train": train_images,
    "validation": val_images,
    "test": test_images
}

for split_name, images in splits.items():
    for image in images:
        category = image.parent.name

        destination = (
            OUTPUT_DIR / split_name / category / image.name
        )

        destination.parent.mkdir(parents=True, exist_ok=True)

        shutil.copy2(image, destination)

    print(f"{split_name}: {len(images)} images")

print("\nDataset split completed!")

print("\nCategory distribution:")

for category in sorted(set(all_labels)):
    print(f"\n{category}")

    for split_name, images in splits.items():
        count = sum(
            1 for image in images
            if image.parent.name == category
        )
        print(f"  {split_name}: {count}")

print("\nDataset location:", OUTPUT_DIR)
