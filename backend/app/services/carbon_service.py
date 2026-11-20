
def calculate_co2_savings(category: str, pathway: str):
    """
    Estimate potential CO2e savings for eligible reused devices.

    Values are initial project assumptions based on the
    device reuse estimates discussed earlier.
    """

    if pathway != "Reuse":
        return None

    category = (category or "").strip().lower()

    co2_savings = {
        "mobile": 34.7,
        "smartphone": 34.7,
        "laptop": 107.0,
    }

    return co2_savings.get(category)
