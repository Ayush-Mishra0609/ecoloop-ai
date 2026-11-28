
import { useState, useEffect } from "react";
import { getDashboardDevices } from "../services/dashboardService";
import { Link } from "react-router-dom";
import {
  Recycle, LayoutDashboard, Smartphone,
  MapPin, History, Settings, LogOut,
  TrendingUp, Leaf, IndianRupee,
  ArrowUpRight, Plus, Menu, X
} from "lucide-react";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardDevices();
      setDevices(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load devices.");
    } finally {
      setLoading(false);
    }
  };

  fetchDevices();
}, []);

  
const totalDevices = devices.length;
const totalCo2Saved = devices.reduce(
  (total, device) => {
    return total + Number(device.estimated_co2_kg || 0);
  },
  0
);
// Estimated base recovery values in INR (editable assumptions)
const recoveryBaseValues = {
  mobile: 8000,
  laptop: 18000,
  battery: 500,
  cable: 100,
  keyboard: 300,
  mouse: 150,
  pcb: 700,
};

const pathwayMultipliers = {
  Reuse: 1.0,
  Repair: 0.65,
  Recycle: 0.12,
};

// Adjust estimated value according to device condition
const getConditionMultiplier = (device) => {
  const score = Number(device.condition_score);

  if (!Number.isFinite(score)) return 1;

  if (score >= 80) return 1;
  if (score >= 60) return 0.8;
  if (score >= 40) return 0.6;
  return 0.4;
};

const calculateRecoveryValue = (device) => {
  // Prefer an actual value already calculated by the backend
  if (device.estimated_recovery_value_inr != null) {
    return Number(device.estimated_recovery_value_inr) || 0;
  }

  const category = (
    device.confirmed_category ||
    device.ai_classification ||
    ""
  ).toLowerCase().replace(/[^a-z]/g, "");

  const pathway = device.recommended_pathway;

  const baseValue = recoveryBaseValues[category];
  const pathwayMultiplier = pathwayMultipliers[pathway];

  if (baseValue == null || pathwayMultiplier == null) {
    return 0;
  }

  return (
    baseValue *
    pathwayMultiplier *
    getConditionMultiplier(device)
  );
};

const totalRecoveryValue = devices.reduce(
  (total, device) => total + calculateRecoveryValue(device),
  0
);

const recoveryCounts = {
  Reuse: devices.filter(
    (device) => device.recommended_pathway === "Reuse"
  ).length,

  Repair: devices.filter(
    (device) => device.recommended_pathway === "Repair"
  ).length,

  Recycle: devices.filter(
    (device) => device.recommended_pathway === "Recycle"
  ).length,
};

const classifiedDevices =
  recoveryCounts.Reuse +
  recoveryCounts.Repair +
  recoveryCounts.Recycle;

const getPercentage = (count) => {
  return classifiedDevices > 0
    ? Math.round((count / classifiedDevices) * 100)
    : 0;
};

const recoveryDistribution = [
  {
    name: "Reuse",
    count: recoveryCounts.Reuse,
    percentage: getPercentage(recoveryCounts.Reuse),
    className: "reuse",
  },
  {
    name: "Repair",
    count: recoveryCounts.Repair,
    percentage: getPercentage(recoveryCounts.Repair),
    className: "repair",
  },
  {
    name: "Recycle",
    count: recoveryCounts.Recycle,
    percentage: getPercentage(recoveryCounts.Recycle),
    className: "recycle",
  },
];


const workingDevices = devices.filter(
  (device) => device.working_status === "Yes"
).length;

const stats = [
  {
    title: "Devices Analyzed",
    value: loading ? "..." : totalDevices,
    change: "Total registered devices",
    icon: Smartphone
  },
  {
    title: "Working Devices",
    value: loading ? "..." : workingDevices,
    change: "Fully working devices",
    icon: Recycle
  },
  {
    title: "Recovery Value",
    value: loading
      ? "..."
      : `₹${totalRecoveryValue.toLocaleString("en-IN", {
          maximumFractionDigits: 0
        })}`,
    change: "Estimated total recovery value",
    icon: IndianRupee
  },
  {
    title: "CO₂ Saved",
    value: loading
      ? "..."
      : `${totalCo2Saved.toFixed(1)} kg`,
    change: "Estimated CO₂e emissions avoided",
    icon: Leaf
  }
];


  const activities = devices.map((device) => ({
  id: device.id,
  name: device.device_name || "Unnamed Device",
  category: device.confirmed_category || device.ai_classification || "Unknown",
  status: device.working_status || "Unknown",
  date: new Date(device.created_at).toLocaleDateString("en-IN"),
}));
  return (
    <div className="dashboard-layout">

      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>

        <Link to="/" className="dashboard-logo">
          <Recycle size={28} />
          EcoLoop AI
        </Link>

        <p className="sidebar-label">MAIN MENU</p>

        <nav className="sidebar-nav">
          <a href="#overview" className="active">
            <LayoutDashboard size={19} /> Overview
          </a>

          <Link to="/upload">
            <Smartphone size={19} /> Analyze Device
          </Link>

          <Link to="/providers">
            <MapPin size={19} /> Recovery Centres
          </Link>

          <Link to="/history">
            <History size={19} /> History
          </Link>

          <Link to="/settings">
  <Settings size={19} /> Settings
</Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div>
              <strong>EcoLoop User</strong>
              <p>Member</p>
            </div>
          </div>

          <Link to="/login" className="logout-link">
            <LogOut size={18} /> Sign Out
          </Link>
        </div>

      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="dashboard-main" id="overview">

        <header className="dashboard-header">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div>
            <h2>Dashboard Overview</h2>
            <p>Welcome back! Here's your sustainability impact.</p>
          </div>

          <div className="header-actions">
            <div className="header-avatar">A</div>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <span>YOUR SUSTAINABILITY JOURNEY</span>
            <h1>Make Every Device Count.</h1>
            <p>
              Discover the hidden value in your old electronics
              with AI-powered recovery intelligence.
            </p>

            <Link to="/upload" className="dashboard-primary">
              <Plus size={18} /> Analyze a Device
            </Link>
          </div>

          <div className="welcome-icon">
            <Recycle size={100} />
          </div>
        </section>

        <section className="stats-grid">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div className="stat-card" key={index}>
                <div className="stat-top">
                  <span>{stat.title}</span>
                  <div className="stat-icon">
                    <Icon size={21} />
                  </div>
                </div>

                <h2>{stat.value}</h2>
                <p>{stat.change}</p>
              </div>
            );
          })}

        </section>

        <section className="dashboard-content">

          <div className="dashboard-panel distribution-panel">
            <div className="panel-heading">
              <div>
                <h3>Recovery Distribution</h3>
                <p>How your devices can be recovered</p>
              </div>
              <TrendingUp color="#16a34a" />
            </div>

            
<div className="distribution-chart">
  {loading ? (
    <p>Loading recovery statistics...</p>
  ) : recoveryDistribution.every((item) => item.count === 0) ? (
    <p>No recovery recommendations available yet.</p>
  ) : (
    recoveryDistribution.map((item) => (
      <div className="distribution-item" key={item.name}>
        <div className="distribution-label">
          <span>{item.name} ({item.count})</span>
          <strong>{item.percentage}%</strong>
        </div>

        <div className="progress-track">
          <div
            className={`progress-fill ${item.className}`}
            style={{ width: `${item.percentage}%` }}
          />
        </div>
      </div>
    ))
  )}
</div>


            <p className="chart-note">
              <Leaf size={16} /> Prioritize reuse and repair
              to reduce electronic waste.
            </p>
          </div>

          <div className="dashboard-panel impact-panel">
            <div className="panel-heading">
              <div>
                <h3>Environmental Impact</h3>
                <p>Your contribution so far</p>
              </div>
              <Leaf color="#16a34a" />
            </div>

            <div className="impact-value">
              {loading ? "..." : `${totalCo2Saved.toFixed(1)} kg`}
            </div>

            <p className="impact-caption">
                Estimated CO₂e emissions avoided
            </p>

            <div className="impact-footer">
              <span>Keep making a difference!</span>
              <Leaf size={22} />
            </div>
          </div>

        </section>

        <section className="dashboard-panel activity-panel" id="activity">

          <div className="panel-heading">
            <div>
              <h3>Recent Device Analyses</h3>
              <p>Your recently analyzed electronics</p>
            </div>

            <Link to="/history" className="view-all">
  View All <ArrowUpRight size={16} />
</Link>
          </div>

          <div className="activity-table">

            <div className="activity-row activity-header">
              <span>Device</span>
              <span>Category</span>
              <span>Recovery Path</span>
              <span>Date</span>
            </div>

            
{loading ? (
  <p className="empty-state">Loading your devices...</p>
) : error ? (
  <p className="empty-state">{error}</p>
) : activities.length === 0 ? (
  <p className="empty-state">
    No devices found. Analyze your first device!
  </p>
) : (
  activities.slice(0, 5).map((item) => (
    <div className="activity-row" key={item.id}>
      <strong>{item.name}</strong>
      <span>{item.category}</span>
      <span>{item.status}</span>
      <span>{item.date}</span>
    </div>
  ))
)}


          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
