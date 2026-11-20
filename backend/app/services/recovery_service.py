
def recommend_recovery_pathway(working_status: str, condition: str):
    """
    Recommend a recovery pathway based on device condition
    and working status.
    """

    status = (working_status or "").strip().lower()
    device_condition = (condition or "").strip().lower()

    # Completely damaged and non-working
    if status == "no" and device_condition == "damaged":
        return {
            "pathway": "Recycle",
            "reason": "Device is non-functional and physically damaged."
        }

    # Partially working or in poor/fair condition
    if status == "partially" or device_condition in ["fair", "poor"]:
        return {
            "pathway": "Repair",
            "reason": "Device may benefit from repair or refurbishment."
        }

    # Fully functional and in good condition
    if status == "yes" and device_condition in ["excellent", "good"]:
        return {
            "pathway": "Reuse",
            "reason": "Device is functional and suitable for continued use."
        }

    # Conservative fallback for uncertain combinations
    return {
        "pathway": "Repair",
        "reason": "Further inspection is recommended before deciding."
    }
