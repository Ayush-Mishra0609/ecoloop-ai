
from app.services.gemini_service import analyze_device_description


description = """
My laptop takes a long time to start.
The battery drains within 30 minutes.
Sometimes the laptop shuts down randomly.
There is also a small crack near the hinge.
"""

result = analyze_device_description(description)

print("\nGEMINI DESCRIPTION ANALYSIS")
print("---------------------------")

print("Summary:", result["summary"])
print("Issues:", result["issues"])

print("Performance issue:", result["performance_issue"])
print("Battery issue:", result["battery_issue"])
print("Functional issue:", result["functional_issue"])
print("Physical damage:", result["physical_damage_issue"])
