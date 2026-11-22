
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Custom marker icons
const repairIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const recycleIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Automatically zoom to display all centres
function FitBounds({ centres }) {
  const map = useMap();

  useEffect(() => {
    const validCentres = centres.filter(
      (centre) =>
        Number.isFinite(Number(centre.latitude)) &&
        Number.isFinite(Number(centre.longitude))
    );

    if (!validCentres.length) return;

    const bounds = L.latLngBounds(
      validCentres.map((centre) => [
        Number(centre.latitude),
        Number(centre.longitude),
      ])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [centres, map]);

  return null;
}

// Focus and open the selected centre
function FocusSelectedCentre({
  centres,
  selectedCentreId,
  markerRefs,
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedCentreId == null) return;

    const centre = centres.find(
      (item) =>
        String(item.id) === String(selectedCentreId)
    );

    if (!centre) return;

    const marker = markerRefs.current[String(centre.id)];

    if (!marker) {
      console.log("Marker not found:", centre.id);
      return;
    }

    const latitude = Number(centre.latitude);
    const longitude = Number(centre.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    map.flyTo([latitude, longitude], 15, {
      duration: 1,
    });

    map.once("moveend", () => {
      marker.openPopup();
    });
  }, [selectedCentreId, centres, map, markerRefs]);

  return null;
}

// Main map component
function RecoveryMap({ centres, selectedCentreId }) {
  const markerRefs = useRef({});

  const firstCentre = centres[0];

  const mapCenter = firstCentre
    ? [
        Number(firstCentre.latitude),
        Number(firstCentre.longitude),
      ]
    : [19.033, 73.029];

  return (
    <div className="recovery-map">

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot repair-dot"></span>
          Repair Centre
        </div>

        <div className="legend-item">
          <span className="legend-dot recycle-dot"></span>
          Recycling Centre
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "450px", width: "100%" }}
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds centres={centres} />

        <FocusSelectedCentre
          centres={centres}
          selectedCentreId={selectedCentreId}
          markerRefs={markerRefs}
        />

        {centres.map((centre) => (
          <Marker
            key={centre.id}
            position={[
              Number(centre.latitude),
              Number(centre.longitude),
            ]}
            icon={
              centre.type === "Repair"
                ? repairIcon
                : recycleIcon
            }
            ref={(marker) => {
              const id = String(centre.id);

              if (marker) {
                markerRefs.current[id] = marker;
              } else {
                delete markerRefs.current[id];
              }
            }}
          >
            <Popup>
              <strong>{centre.name}</strong>
              <p>{centre.type} Centre</p>
              <p>{centre.address}</p>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${centre.latitude},${centre.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions
              </a>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}

export default RecoveryMap;
