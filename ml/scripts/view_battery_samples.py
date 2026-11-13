
from pathlib import Path
from PIL import Image, ImageDraw
import random
import math

ML_DIR = Path(__file__).resolve().parents[1]

BATTERY_DIR = (
    ML_DIR / "datasets" / "ecoloop_split" / "train" / "Battery"
)

OUTPUT_PATH = ML_DIR / "models" / "battery_samples.png"

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
SAMPLE_SIZE = 60
SEED = 42

images = [
    p for p in BATTERY_DIR.rglob("*")
    if p.is_file() and p.suffix.lower() in EXTENSIONS
]

random.seed(SEED)
samples = random.sample(images, min(SAMPLE_SIZE, len(images)))

COLS = 6
CELL_W = 180
CELL_H = 160
THUMB_W = 160
THUMB_H = 125

rows = math.ceil(len(samples) / COLS)

sheet = Image.new(
    "RGB",
    (COLS * CELL_W, rows * CELL_H),
    "white"
)

draw = ImageDraw.Draw(sheet)

for i, path in enumerate(samples):
    try:
        img = Image.open(path).convert("RGB")
        img.thumbnail((THUMB_W, THUMB_H))

        x = (i % COLS) * CELL_W
        y = (i // COLS) * CELL_H

        paste_x = x + (CELL_W - img.width) // 2
        paste_y = y + 5

        sheet.paste(img, (paste_x, paste_y))

        filename = path.name[:22]

        draw.text(
            (x + 5, y + 135),
            filename,
            fill="black"
        )

    except Exception as e:
        print("Skipping:", path.name, e)

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
sheet.save(OUTPUT_PATH)

print("Contact sheet created:", OUTPUT_PATH)
print("Images displayed:", len(samples))
