
from contextlib import asynccontextmanager

from fastapi import (
    FastAPI, UploadFile, File, Form, HTTPException
)
from fastapi.middleware.cors import CORSMiddleware

from app.services.prediction_service import DevicePredictionService


# Load model once when the API starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting EcoLoop AI API...")

    app.state.prediction_service = DevicePredictionService()

    yield

    print("Shutting down EcoLoop AI API...")


app = FastAPI(
    title="EcoLoop AI API",
    description="AI-powered E-waste Recovery Intelligence",
    version="1.0.0",
    lifespan=lifespan
)


# React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to EcoLoop AI API",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": "EcoLoop AI"
    }


@app.post("/api/devices/analyze")
async def analyze_device(
    image: UploadFile = File(...),
    device_name: str = Form(...),
    category: str = Form(...),
    brand: str = Form(...),
    model: str = Form(""),
    purchase_year: str = Form(""),
    condition: str = Form(...),
    working_status: str = Form(...),
    description: str = Form("")
):

    # Validate image type
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed."
        )

    # Read and validate image
    image_data = await image.read()

    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 5 MB."
        )

    if len(image_data) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    try:
        # Run MobileNetV2 prediction
        prediction = app.state.prediction_service.predict(
            image_data
        )

    except Exception as e:
        print("Prediction error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to analyze the uploaded image."
        )

    return {
        "success": True,
        "message": "Device analyzed successfully!",

        "device": {
            "device_name": device_name,
            "category": category,
            "brand": brand,
            "model": model,
            "purchase_year": purchase_year,
            "condition": condition,
            "working_status": working_status,
            "description": description,
            "image_filename": image.filename
        },

        "analysis": {
            "status": "completed",
            "classification": prediction["category"],
            "confidence": prediction["confidence"],
            "top_predictions": prediction["top_predictions"],
            "estimated_value": None,
            "recommended_pathway": None
        }
    }
