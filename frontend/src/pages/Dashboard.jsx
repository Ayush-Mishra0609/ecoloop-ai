
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle, LayoutDashboard, Smartphone,
  MapPin, History, Settings, LogOut,
  TrendingUp, Leaf, IndianRupee,
  ArrowUpRight, Plus, Menu, X
} from "lucide-react";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Devices Analyzed",
      value: "128",
      change: "+12 this month",
      icon: Smartphone
    },
    {
      title: "Reuse Potential",
      value: "68%",
      change: "+8% this month",
      icon: Recycle
    },
    {
      title: "Recovery Value",
      value: "₹24,500",
      change: "+15% this month",
      icon: IndianRupee
    },
    {
      title: "CO₂ Saved",
      value: "86 kg",
      change: "Estimated impact",
      icon: Leaf
    }
  ];

  const activities = [
    { name: "Dell Laptop", category: "Laptop", status: "Reuse", date: "Today" },
    { name: "Samsung Phone", category: "Smartphone", status: "Repair", date: "Yesterday" },
    { name: "HP Monitor", category: "Monitor", status: "Recycle", date: "28 Oct" },
    { name: "Wireless Keyboard", category: "Accessory", status: "Reuse", date: "27 Oct" }
  ];

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

          <a href="#activity">
            <History size={19} /> History
          </a>

          <a href="#settings">
            <Settings size={19} /> Settings
          </a>
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
              <div className="distribution-item">
                <div className="distribution-label">
                  <span>Reuse</span><strong>45%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill reuse" />
                </div>
              </div>

              <div className="distribution-item">
                <div className="distribution-label">
                  <span>Repair</span><strong>23%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill repair" />
                </div>
              </div>

              <div className="distribution-item">
                <div className="distribution-label">
                  <span>Recycle</span><strong>32%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill recycle" />
                </div>
              </div>
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

            <div className="impact-value">86 kg</div>
            <p className="impact-caption">
              Estimated CO₂ emissions avoided
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

            <a href="#overview" className="view-all">
              View All <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="activity-table">

            <div className="activity-row activity-header">
              <span>Device</span>
              <span>Category</span>
              <span>Recovery Path</span>
              <span>Date</span>
            </div>

            {activities.map((item, index) => (
              <div className="activity-row" key={index}>
                <strong>{item.name}</strong>
                <span>{item.category}</span>

                <span className={`status-badge ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>

                <span>{item.date}</span>
              </div>
            ))}

          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
