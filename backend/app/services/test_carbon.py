from app.services.carbon_service import calculate_co2_savings

categories = [
    "Mobile",
    "Laptop",
    "Tablet",
    "Monitor",
    "Television",
    "Desktop",
    "Printer"
]

pathways = ["Reuse", "Repair", "Recycle"]

for category in categories:
    print(f"\n{category}:")

    for pathway in pathways:
        result = calculate_co2_savings(category, pathway)

        print(f"{pathway}: {result} kg CO2e")