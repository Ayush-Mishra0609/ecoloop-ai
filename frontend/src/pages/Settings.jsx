
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Recycle, LayoutDashboard, Smartphone,
  MapPin, History, Settings as SettingsIcon,
  LogOut, Menu, X, User, Bell, Lock,
  Palette, ShieldCheck, Save
} from "lucide-react";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: "EcoLoop User",
    email: ""
  });

  const [notifications, setNotifications] = useState({
    deviceUpdates: true,
    recoveryUpdates: true,
    sustainabilityTips: false
  });

  const { darkMode, setDarkMode } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    // UI-only for now. Backend persistence can be added later.
    setSaved(true);
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>

        <Link to="/" className="dashboard-logo">
          <Recycle size={28} />
          EcoLoop AI
        </Link>

        <p className="sidebar-label">MAIN MENU</p>

        <nav className="sidebar-nav">

          <Link to="/dashboard">
            <LayoutDashboard size={19} /> Overview
          </Link>

          <Link to="/upload">
            <Smartphone size={19} /> Analyze Device
          </Link>

          <Link to="/providers">
            <MapPin size={19} /> Recovery Centres
          </Link>

          <Link to="/history">
            <History size={19} /> History
          </Link>

          <Link to="/settings" className="active">
            <SettingsIcon size={19} /> Settings
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div>
              <strong>{profile.name}</strong>
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

      {/* Main Content */}
      <main className="dashboard-main settings-main">

        <header className="dashboard-header">

          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div>
            <h2>Settings</h2>
            <p>Manage your account and application preferences.</p>
          </div>

          <div className="header-actions">
            <div className="header-avatar">A</div>
          </div>

        </header>

        <section className="settings-welcome">
          <h1>Account Settings</h1>
          <p>
            Customize your EcoLoop AI experience and manage
            your account preferences.
          </p>
        </section>

        {/* Profile Settings */}
        <section className="settings-card">

          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <User />
            </div>

            <div>
              <h3>Profile Information</h3>
              <p>Manage your personal account details.</p>
            </div>
          </div>

          <form onSubmit={handleSave}>

            <div className="settings-form-grid">

              <div className="settings-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="settings-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                />
              </div>

            </div>

            <button type="submit" className="settings-save-btn">
              <Save size={17} /> Save Changes
            </button>

            {saved && (
              <p className="settings-success">
                Changes saved in this session.
              </p>
            )}

          </form>

        </section>

        {/* Notification Settings */}
        <section className="settings-card">

          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <Bell />
            </div>

            <div>
              <h3>Notification Preferences</h3>
              <p>Choose which notifications you want to receive.</p>
            </div>
          </div>

          <div className="settings-option">
            <div>
              <strong>Device Analysis Updates</strong>
              <p>Receive updates when device analysis is completed.</p>
            </div>

            <input
              type="checkbox"
              checked={notifications.deviceUpdates}
              onChange={() => toggleNotification("deviceUpdates")}
            />
          </div>

          <div className="settings-option">
            <div>
              <strong>Recovery Updates</strong>
              <p>Get updates about device recovery recommendations.</p>
            </div>

            <input
              type="checkbox"
              checked={notifications.recoveryUpdates}
              onChange={() => toggleNotification("recoveryUpdates")}
            />
          </div>

          <div className="settings-option">
            <div>
              <strong>Sustainability Tips</strong>
              <p>Receive tips to reduce electronic waste.</p>
            </div>

            <input
              type="checkbox"
              checked={notifications.sustainabilityTips}
              onChange={() => toggleNotification("sustainabilityTips")}
            />
          </div>

        </section>

        {/* Appearance */}
        <section className="settings-card">

          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <Palette />
            </div>

            <div>
              <h3>Appearance</h3>
              <p>Customize how EcoLoop AI looks.</p>
            </div>
          </div>

          <div className="settings-option">
            <div>
              <strong>Dark Mode</strong>
              <p>Switch between light and dark appearance.</p>
            </div>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>

        </section>

        {/* Security */}
        <section className="settings-card">

          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <ShieldCheck />
            </div>

            <div>
              <h3>Privacy & Security</h3>
              <p>Information about your account security.</p>
            </div>
          </div>

          <div className="settings-option">
            <div>
              <strong>Account Protection</strong>
              <p>Your account is protected by the authentication system.</p>
            </div>
            <Lock color="#16a34a" size={22} />
          </div>

          <div className="settings-option">
            <div>
              <strong>Data Privacy</strong>
              <p>Your registered device information is managed securely.</p>
            </div>
            <ShieldCheck color="#16a34a" size={22} />
          </div>

        </section>

        <p className="settings-footer">
          EcoLoop AI · Making Every Device Count ♻
        </p>

      </main>
    </div>
  );
}

export default Settings;
