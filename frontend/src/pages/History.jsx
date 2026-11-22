
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  ArrowLeft,
  Smartphone,
  Leaf,
  RefreshCw
} from "lucide-react";

import { getDashboardDevices } from "../services/dashboardService";
import { supabase } from "../services/supabase";

function History() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPathway, setSelectedPathway] = useState("All");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardDevices();

const devicesWithImages = await Promise.all(
  data.map(async (device) => {
    if (!device.image_url) {
      return { ...device, imagePreview: null };
    }

    const { data: imageData, error: imageError } = await supabase.storage
      .from("device-images")
      .createSignedUrl(device.image_url, 3600);

    if (imageError) {
      console.error("Image URL error:", imageError);
      return { ...device, imagePreview: null };
    }

    return {
      ...device,
      imagePreview: imageData.signedUrl,
    };
  })
);

setDevices(devicesWithImages);
      } catch (err) {
        console.error("History fetch error:", err);
        setError(err.message || "Failed to load recovery history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getPathwayClass = (pathway) => {
    if (pathway === "Reuse") return "reuse";
    if (pathway === "Repair") return "repair";
    if (pathway === "Recycle") return "recycle";
    return "unknown";
  };
  const filteredDevices = devices.filter((device) => {
  const category = device.confirmed_category || device.ai_classification;

  const categoryMatch =
    selectedCategory === "All" || category === selectedCategory;

  const pathwayMatch =
    selectedPathway === "All" ||
    device.recommended_pathway === selectedPathway;

  return categoryMatch && pathwayMatch;
});

  return (
    <div className="history-page">

      <header className="history-header">
        <Link to="/dashboard" className="history-back">
          <ArrowLeft size={18} /> Dashboard
        </Link>

        <Link to="/" className="history-logo">
          <Recycle size={26} />
          EcoLoop AI
        </Link>

        <Link to="/upload" className="history-analyze">
          + Analyze Device
        </Link>
      </header>

      <main className="history-container">

        <div className="history-heading">
          <div>
            <span className="history-eyebrow">
              YOUR DEVICE JOURNEY
            </span>
            <h1>Recovery History</h1>
            <p>
              Track your analyzed devices, AI predictions,
              and recommended recovery pathways.
            </p>
          </div>

          <div className="history-heading-icon">
            <RefreshCw size={48} />
          </div>
        </div>

        <div className="history-summary">
          <div className="history-summary-card">
            <Smartphone size={22} />
            <div>
              <span>Total Devices</span>
              <strong>{loading ? "..." : devices.length}</strong>
            </div>
          </div>

          <div className="history-summary-card">
            <Leaf size={22} />
            <div>
              <span>Estimated CO₂ Saved</span>
              <strong>
                {loading
                  ? "..."
                  : `${devices.reduce(
                      (total, device) =>
                        total + Number(device.estimated_co2_kg || 0),
                      0
                    ).toFixed(1)} kg`}
              </strong>
            </div>
          </div>
        </div>

        <section className="history-list-section">
          
<div className="history-list-heading">
  <div>
    <h2>Analyzed Devices</h2>
    <p>Your complete device analysis records</p>
  </div>
</div>

<div className="history-filters">
  <div>
    <label>Device Category</label>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="All">All Categories</option>
      <option value="Battery">Battery</option>
      <option value="Cable">Cable</option>
      <option value="Keyboard">Keyboard</option>
      <option value="Laptop">Laptop</option>
      <option value="Mobile">Mobile</option>
      <option value="Mouse">Mouse</option>
      <option value="PCB">PCB</option>
    </select>
  </div>

  <div>
    <label>Recovery Pathway</label>
    <select
      value={selectedPathway}
      onChange={(e) => setSelectedPathway(e.target.value)}
    >
      <option value="All">All Pathways</option>
      <option value="Reuse">Reuse</option>
      <option value="Repair">Repair</option>
      <option value="Recycle">Recycle</option>
    </select>
  </div>
</div>


          {loading ? (
            <p className="history-message">Loading your recovery history...</p>
          ) : error ? (
            <p className="history-message error">{error}</p>
          ) : devices.length === 0 ? (
            <div className="history-empty">
              <Recycle size={42} />
              <h3>No devices analyzed yet</h3>
              <p>Start by uploading your first electronic device.</p>
              <Link to="/upload">Analyze Your First Device</Link>
            </div>
          ) : (
            <div className="history-device-list">

              {filteredDevices.length === 0 ? (
  <p className="history-message">
    No devices match the selected filters.
  </p>
) : (
  filteredDevices.map((device) => (
                <article className="history-device-card" key={device.id}>

                  <div className="history-device-icon">
  {device.imagePreview ? (
    <img
      src={device.imagePreview}
      alt={device.device_name}
    />
  ) : (
    <Smartphone size={30} />
  )}
</div>

                  <div className="history-device-info">
                    <h3>{device.device_name || "Unnamed Device"}</h3>

                    <p>
                      {device.brand || "Unknown Brand"}
                      {device.model ? ` • ${device.model}` : ""}
                    </p>

                    <div className="history-device-details">
                      <span>
                        AI Prediction: {device.ai_classification || "N/A"}
                      </span>

                      <span>
                        Confirmed Category: {device.confirmed_category || "Not confirmed"}
                      </span>

                      <span>
                        Confidence:{" "}
                        {device.ai_confidence != null
                          ? `${(Number(device.ai_confidence) * 100).toFixed(1)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="history-device-result">
                    <span className={`pathway-badge ${getPathwayClass(device.recommended_pathway)}`}>
                      {device.recommended_pathway || "Not available"}
                    </span>

                    <p>
                      CO₂ Saved:{" "}
                      {device.estimated_co2_kg != null
                        ? `${Number(device.estimated_co2_kg).toFixed(1)} kg`
                        : "N/A"}
                    </p>

                    <small>
                      {new Date(device.created_at).toLocaleDateString("en-IN")}
                    </small>
                  </div>

                </article>
              ))
)}

            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default History;
