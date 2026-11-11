
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EcoLoop AI API",
    description="AI-powered E-waste Recovery Intelligence",
    version="1.0.0"
)

# Allow React frontend to communicate with FastAPI
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

    # Read image and validate size
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

    # Temporary analysis response.
    # Actual ML models will be integrated later.

    return {
        "success": True,
        "message": "Device received successfully!",
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
            "status": "pending",
            "classification": "Not yet implemented",
            "estimated_value": None,
            "recommended_pathway": None
        }
    }
