

def assess_device_condition(
    working_status: str,
    condition: str,
    performance: str,
    battery_health: str,
    physical_damage: str,
    purchase_year: str = "",
    description: str = "",
    description_analysis: dict = None
):
    """
    Hybrid condition assessment using structured inputs and Gemini.
    """

    status = (working_status or "").strip().lower()
    device_condition = (condition or "").strip().lower()
    device_performance = (performance or "").strip().lower()
    battery = (battery_health or "").strip().lower()
    damage = (physical_damage or "").strip().lower()

    gemini = description_analysis or {}

    score = 100
    issues = []

    # 1. Overall user-reported condition
    condition_scores = {
        "excellent": 0,
        "good": 5,
        "fair": 15,
        "poor": 30,
        "damaged": 40
    }

    score -= condition_scores.get(device_condition, 10)

    # 2. Working status
    if status in ["no", "not working"]:
        score -= 35
        issues.append("Device is not working.")

    elif status in ["partially", "partially working"]:
        score -= 20
        issues.append("Device is partially functional.")

    # 3. Performance
    performance_penalties = {
        "slow": 10,
        "fair": 20,
        "poor": 20,
        "frequently hangs": 20,
        "frequently hangs or freezes": 20
    }

    performance_penalty = performance_penalties.get(
        device_performance, 0
    )

    score -= performance_penalty

    if performance_penalty:
        issues.append("Device performance is poor or unstable.")

    # 4. Battery health
    battery_penalties = {
        "drains quickly": 10,
        "degraded": 10,
        "not working": 20,
        "failed": 20
    }

    battery_penalty = battery_penalties.get(battery, 0)
    score -= battery_penalty

    if battery_penalty:
        issues.append("Battery health is degraded.")

    # 5. Physical damage
    damage_scores = {
        "none": 0,
        "minor": 5,
        "small scratches": 5,
        "scratches": 5,
        "moderate": 15,
        "cracks": 15,
        "severe": 30,
        "major damage": 30
    }

    damage_penalty = damage_scores.get(damage, 0)
    score -= damage_penalty

    if damage_penalty:
        issues.append(f"Physical damage reported: {damage}.")

    # 6. Device age
    try:
        if purchase_year:
            age = 2026 - int(purchase_year)

            if age >= 8:
                score -= 15
                issues.append("Device is relatively old.")

            elif age >= 5:
                score -= 8
                issues.append("Device has been used for several years.")

    except (ValueError, TypeError):
        pass

    # 7. Gemini analysis
    # Apply additional deductions only when the form
    # has not already accounted for the issue.

    if gemini.get("performance_issue") and performance_penalty == 0:
        score -= 10
        issues.append("Gemini detected a performance issue.")

    if gemini.get("battery_issue") and battery_penalty == 0:
        score -= 10
        issues.append("Gemini detected a battery issue.")

    if gemini.get("functional_issue") and status not in [
        "no", "not working", "partially", "partially working"
    ]:
        score -= 15
        issues.append("Gemini detected a functional issue.")

    if gemini.get("physical_damage_issue") and damage_penalty == 0:
        score -= 10
        issues.append("Gemini detected possible physical damage.")

    # 8. Include issues extracted from Gemini
    for issue in gemini.get("issues", []):
        if isinstance(issue, str) and issue.strip():
            reported_issue = f"Description-reported issue: {issue.strip()}."

            if reported_issue not in issues:
                issues.append(reported_issue)

    # 9. Keep score within valid range
    score = max(0, min(100, score))

    # 10. Condition classification
    if score >= 85:
        category = "Excellent"
    elif score >= 70:
        category = "Good"
    elif score >= 45:
        category = "Fair"
    else:
        category = "Poor"

    if not issues:
        issues.append("No major issues reported.")
    all_detected_issues = list(dict.fromkeys(issues))
    return {
        "condition_score": score,
        "condition_category": category,
        "identified_issues": all_detected_issues
    }


def recommend_recovery_pathway(
    working_status: str,
    condition: str,
    condition_score: int = 100,
    physical_damage: str = ""
):
    """
    Recommend a recovery pathway using the assessed condition.
    """

    status = (working_status or "").strip().lower()
    device_condition = (condition or "").strip().lower()
    damage = (physical_damage or "").strip().lower()

    # Non-functional and severely damaged devices
    if (
        status in ["no", "not working"]
        and damage == "severe"
    ):
        return {
            "pathway": "Recycle",
            "reason": "Device is non-functional and severely damaged."
        }

    # Repair recommended for devices with significant issues
    if (
        status in ["partially", "partially working"]
        or device_condition in ["fair", "poor", "damaged"]
        or condition_score < 70
        or damage in ["moderate", "severe"]
    ):
        return {
            "pathway": "Repair",
            "reason": "Device has functional or physical issues and may benefit from repair."
        }

    # Reuse for devices in good condition
    if (
        status in ["yes", "fully working"]
        and condition_score >= 70
    ):
        return {
            "pathway": "Reuse",
            "reason": "Device is functional and suitable for continued use."
        }

    return {
        "pathway": "Repair",
        "reason": "Further inspection is recommended before deciding."
    }
