
import httpx


NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

HEADERS = {
    "User-Agent": "EcoLoopAI/1.0 (e-waste recovery platform)"
}


async def get_coordinates(location: str):
    """Convert a city or location into latitude and longitude."""

    params = {
        "q": f"{location}, India",
        "format": "jsonv2",
        "limit": 1,
        "countrycodes": "in"
    }

    async with httpx.AsyncClient(
        headers=HEADERS,
        timeout=20
    ) as client:

        response = await client.get(
            NOMINATIM_URL,
            params=params
        )

        response.raise_for_status()
        results = response.json()

    if not results:
        return None

    return {
        "latitude": float(results[0]["lat"]),
        "longitude": float(results[0]["lon"]),
        "display_name": results[0]["display_name"]
    }


async def search_recovery_centres(
    location: str,
    centre_type: str = "All"
):
    """Search OpenStreetMap for repair and recycling facilities."""

    coordinates = await get_coordinates(location)

    if not coordinates:
        return {
            "success": True,
            "location": location,
            "total": 0,
            "centres": []
        }

    latitude = coordinates["latitude"]
    longitude = coordinates["longitude"]

    if centre_type == "Repair":
        filters = [
            'node["shop"="electronics"](around:10000,{lat},{lon});',
            'way["shop"="electronics"](around:10000,{lat},{lon});',
            'node["craft"="electronics_repair"](around:10000,{lat},{lon});',
            'way["craft"="electronics_repair"](around:10000,{lat},{lon});'
        ]

    elif centre_type == "Recycle":
        filters = [
            'node["amenity"="recycling"](around:10000,{lat},{lon});',
            'way["amenity"="recycling"](around:10000,{lat},{lon});'
        ]

    else:
        filters = [
            'node["shop"="electronics"](around:10000,{lat},{lon});',
            'way["shop"="electronics"](around:10000,{lat},{lon});',
            'node["craft"="electronics_repair"](around:10000,{lat},{lon});',
            'way["craft"="electronics_repair"](around:10000,{lat},{lon});',
            'node["amenity"="recycling"](around:10000,{lat},{lon});',
            'way["amenity"="recycling"](around:10000,{lat},{lon});'
        ]

    query_parts = [
        item.format(lat=latitude, lon=longitude)
        for item in filters
    ]

    query = f"""
    [out:json][timeout:25];
    (
        {"".join(query_parts)}
    );
    out center tags;
    """

    async with httpx.AsyncClient(
        headers=HEADERS,
        timeout=35
    ) as client:

        response = await client.post(
            OVERPASS_URL,
            data={"data": query}
        )

        response.raise_for_status()
        result = response.json()

    centres = []

    for element in result.get("elements", []):

        tags = element.get("tags", {})

        lat = element.get("lat")
        lon = element.get("lon")

        if lat is None or lon is None:
            center = element.get("center", {})
            lat = center.get("lat")
            lon = center.get("lon")

        if lat is None or lon is None:
            continue

        is_recycling = tags.get("amenity") == "recycling"

        name = tags.get("name", "Unnamed Recovery Centre")

        centres.append({
            "id": f"{element['type']}_{element['id']}",
            "name": name,
            "type": "Recycle" if is_recycling else "Repair",
            "latitude": lat,
            "longitude": lon,
            "address": ", ".join(
                filter(None, [
                    tags.get("addr:housenumber"),
                    tags.get("addr:street"),
                    tags.get("addr:suburb"),
                    tags.get("addr:city")
                ])
            ) or "Address not available",
            "phone": tags.get("phone") or tags.get("contact:phone"),
            "website": tags.get("website") or tags.get("contact:website"),
            "osm_url": f"https://www.openstreetmap.org/{element['type']}/{element['id']}"
        })

    return {
        "success": True,
        "location": coordinates["display_name"],
        "total": len(centres),
        "centres": centres
    }
