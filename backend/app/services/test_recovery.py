
from app.services.recovery_service import (
    assess_device_condition,
    recommend_recovery_pathway
)

# Example laptop assessment
result = assess_device_condition(
    working_status="Partially",
    condition="Good",
    performance="Slow",
    battery_health="Drains quickly",
    physical_damage="Minor",
    purchase_year="2019"
)

print("\nCONDITION ASSESSMENT")
print("--------------------")
print("Score:", result["condition_score"])
print("Condition:", result["condition_category"])
print("Issues:", result["identified_issues"])

recommendation = recommend_recovery_pathway(
    working_status="Partially",
    condition="Good",
    condition_score=result["condition_score"],
    physical_damage="Minor"
)

print("\nRECOVERY RECOMMENDATION")
print("-----------------------")
print("Pathway:", recommendation["pathway"])
print("Reason:", recommendation["reason"])
