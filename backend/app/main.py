
from contextlib import asynccontextmanager

from fastapi import (
    FastAPI, UploadFile, File, Form, HTTPException
)
from fastapi.middleware.cors import CORSMiddleware

from app.services.prediction_service import DevicePredictionService
from app.services.recovery_service import (
    assess_device_condition,
    recommend_recovery_pathway
)
from app.services.carbon_service import calculate_co2_savings
from app.services.provider_service import search_recovery_centres
from app.services.gemini_service import analyze_device_description


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

@app.get("/api/providers/search")
async def get_recovery_centres(
    location: str,
    centre_type: str = "All"
):
    if not location.strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide a location."
        )

    if centre_type not in ["All", "Repair", "Recycle"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid centre type."
        )

    try:
        return await search_recovery_centres(
            location.strip(),
            centre_type
        )

    except Exception as e:
        print("Provider search error:", str(e))

        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve recovery centres right now."
        )


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
    performance: str = Form(...),
    battery_health: str = Form(""),
    physical_damage: str = Form(...),
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
        # 1. Run MobileNetV2 device classification
        prediction = app.state.prediction_service.predict(
            image_data
        )
                # 2. Analyze user's description using Gemini
        description_analysis = {
            "summary": "",
            "issues": [],
            "performance_issue": False,
            "battery_issue": False,
            "functional_issue": False,
            "physical_damage_issue": False
        }

        try:
            if description.strip():
                description_analysis = analyze_device_description(
                    description
                )

        except Exception as e:
            print("Gemini analysis error:", str(e))
            print("Continuing without Gemini analysis...")
        # 2. Assess device condition using user inputs
        condition_assessment = assess_device_condition(
            working_status=working_status,
            condition=condition,
            performance=performance,
            battery_health=battery_health,
            physical_damage=physical_damage,
            purchase_year=purchase_year,
            description=description,
            description_analysis=description_analysis
        )

        # 3. Recommend recovery pathway using assessed condition
        recovery = recommend_recovery_pathway(
            working_status=working_status,
            condition=condition,
            condition_score=condition_assessment["condition_score"],
            physical_damage=physical_damage
        )

        # 4. Calculate estimated carbon savings
        estimated_co2 = calculate_co2_savings(
            prediction["category"],
            recovery["pathway"]
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
            "performance": performance,
            "battery_health": battery_health,
            "physical_damage": physical_damage,
            "description": description,
            "image_filename": image.filename
},

        
        "analysis": {
            "status": "completed",

            # MobileNetV2 classification
            "classification": prediction["category"],
            "confidence": prediction["confidence"],
            "top_predictions": prediction["top_predictions"],
            # Gemini description analysis
            "description_analysis": description_analysis,

            # Hybrid condition assessment
            "condition_score": condition_assessment["condition_score"],
            "condition_category": condition_assessment["condition_category"],
            "identified_issues": condition_assessment["identified_issues"],

            # Recovery recommendation
            "recommended_pathway": recovery["pathway"],
            "recommendation_reason": recovery["reason"],

            # Environmental impact
            "estimated_value": None,
            "estimated_co2_kg": estimated_co2
        }

    }
