
import { useState } from "react";
import RecoveryMap from "../components/RecoveryMap";
import { Link } from "react-router-dom";
import {
  Recycle,
  ArrowLeft,
  Search,
  MapPin,
  Wrench,
  Leaf,
  Phone,
  ExternalLink
} from "lucide-react";
import { searchProviders } from "../services/providerService";

function Providers() {
  const [location, setLocation] = useState("");
  const [centreType, setCentreType] = useState("All");
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedCentreId, setSelectedCentreId] = useState(null);

  const handleSearch = async (e) => {
  e.preventDefault();

  if (!location.trim()) {
    setError("Please enter a city or location.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSearched(false);

    const data = await searchProviders(location, centreType);

    setCentres(data.centres || []);
    setSearched(true);
  } catch (err) {
    console.error("Provider search error:", err);
    setError(err.message || "Unable to search recovery centres.");
    setCentres([]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="providers-page">

      <header className="providers-header">
        <Link to="/dashboard" className="providers-back">
          <ArrowLeft size={18} /> Dashboard
        </Link>

        <Link to="/" className="providers-logo">
          <Recycle size={26} />
          EcoLoop AI
        </Link>

        <Link to="/history" className="providers-history">
          View History
        </Link>
      </header>

      <main className="providers-container">

        <section className="providers-hero">
          <span>RESPONSIBLE E-WASTE MANAGEMENT</span>

          <h1>Find Your Nearest Recovery Centre</h1>

          <p>
            Discover electronics repair services and authorised
            recycling facilities to give your devices a second life.
          </p>

          <div className="providers-hero-icons">
            <Wrench size={35} />
            <Recycle size={35} />
            <Leaf size={35} />
          </div>
        </section>

        <section className="providers-search-card">

          <h2>Search Recovery Centres</h2>
          <p>Enter your city or location to find nearby facilities.</p>

          <form onSubmit={handleSearch}>

            <div className="providers-search-field">
              <MapPin size={20} />

              <input
                type="text"
                placeholder="Enter city or location (e.g. Panvel)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="providers-filter">
              <label>Centre Type</label>

              <select
                value={centreType}
                onChange={(e) => setCentreType(e.target.value)}
              >
                <option value="All">All Centres</option>
                <option value="Repair">Repair Centres</option>
                <option value="Recycle">Recycling Centres</option>
              </select>
            </div>

            <button type="submit" className="providers-search-button">
              <Search size={18} /> Search Centres
            </button>

          </form>
        </section>

        
<section className="providers-results">
  <div>
    <h2>Recovery Network</h2>
    <p>
      {searched && centres.length > 0 && (
<RecoveryMap
  centres={centres}
  selectedCentreId={selectedCentreId}
/>)}
    </p>
  </div>

  {loading ? (
    <div className="providers-empty">
      <p>Searching OpenStreetMap for recovery centres...</p>
    </div>
  ) : error ? (
    <div className="providers-empty">
      <p style={{ color: "#dc2626" }}>{error}</p>
    </div>
  ) : !searched ? (
    <div className="providers-empty">
      <MapPin size={45} />
      <h3>Find a Recovery Centre</h3>
      <p>Enter a location above to discover nearby facilities.</p>
    </div>
  ) : centres.length === 0 ? (
    <div className="providers-empty">
      <MapPin size={45} />
      <h3>No Centres Found</h3>
      <p>Try another location or select a different centre type.</p>
    </div>
  ) : (
    <div className="providers-list">
      {centres.map((centre) => (
        <article className="provider-card" key={centre.id}>
          <div className="provider-card-icon">
            {centre.type === "Repair" ? (
              <Wrench size={27} />
            ) : (
              <Recycle size={27} />
            )}
          </div>

          <div className="provider-card-info">
            <button
  type="button"
  className="show-on-map-button"
  onClick={() => setSelectedCentreId(centre.id)}
>
  <MapPin size={15} />
  Show on Map
</button>
            <h3>{centre.name}</h3>

            <span className={`provider-type ${centre.type.toLowerCase()}`}>
              {centre.type}
            </span>

            <p>
              <MapPin size={14} />
              {centre.address}
            </p>

            {centre.phone && (
              <p>
                <Phone size={14} />
                {centre.phone}
              </p>
            )}

            {centre.website && (
              <a href={centre.website} target="_blank" rel="noreferrer">
                Website <ExternalLink size={13} />
              </a>
            )}

            <a
              href={centre.osm_url}
              target="_blank"
              rel="noreferrer"
            >
              View on OpenStreetMap <ExternalLink size={13} />
            </a>
          </div>

          <a
            className="provider-directions"
            href={`https://www.google.com/maps/dir/?api=1&destination=${centre.latitude},${centre.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
          </a>
        </article>
      ))}
    </div>
  )}
</section>


      </main>
    </div>
  );
}

export default Providers;
