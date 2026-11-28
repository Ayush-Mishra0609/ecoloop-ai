
def calculate_co2_savings(category: str, pathway: str):
    """
    Estimate potential CO2e benefits for electronic devices.

    Baseline values and pathway factors are provisional
    project assumptions, not verified lifecycle assessments.
    """

    category = (category or "").strip().lower()
    pathway = (pathway or "").strip().lower()

    # Provisional baseline CO2e values (kg)
    device_emissions = {
        "mobile": 34.7,
        "smartphone": 34.7,
        "tablet": 45.0,
        "monitor": 120.0,
        "television": 200.0,
        "desktop": 250.0,
        "printer": 100.0,
        "laptop": 107.0
    }

    pathway_factors = {
        "reuse": 1.0,
        "repair": 0.5,
        "recycle": 0.1
    }

    baseline = device_emissions.get(category)
    factor = pathway_factors.get(pathway)

    if baseline is None or factor is None:
        return None

    return round(baseline * factor, 2)
