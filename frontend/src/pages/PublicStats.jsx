import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Analytics.css";

function PublicStats() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `https://snip-url-shortener-f8zm.onrender.com/api/url/public/${shortCode}`
      );

      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return <h2 className="loading">Loading public stats...</h2>;
  }

  return (
    <div className="analytics-page">
      <nav className="analytics-nav">
        <div className="analytics-brand">
          <div className="brand-icon">🔗</div>
          <h2>Snip</h2>
        </div>
      </nav>

      <main className="analytics-main">
        <Link to="/" className="back-link">
          ← Home
        </Link>

        <h1>Public link stats</h1>

        <div className="url-line">
          <span>Short code: {data.shortCode}</span>
          <span>→</span>
          <span>{data.originalUrl}</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p>Total clicks</p>
            <h2>{data.totalClicks}</h2>
          </div>

          <div className="stat-card">
            <p>Created on</p>
            <h2>{new Date(data.createdAt).toLocaleDateString()}</h2>
          </div>

          <div className="stat-card">
            <p>Last visited</p>
            <h2>
              {data.lastVisited
                ? new Date(data.lastVisited).toLocaleString()
                : "—"}
            </h2>
          </div>
        </div>

        <div className="visits-card">
          <h3>Recent visits</h3>

          <div className="visits-container">
            {data.recentVisits?.length > 0 ? (
              data.recentVisits.map((visit) => (
                <div className="visit-card" key={visit._id}>
                  <div className="visit-top">
                    <div className="visit-date">
                      {new Date(visit.visitedAt).toLocaleString()}
                    </div>

                    <div className="device-badge">
                      {visit.device || "Desktop"}
                    </div>
                  </div>

                  <div className="visit-details">
                    <div className="detail-chip">
                      Browser: {visit.browser || "Unknown"}
                    </div>

                    <div className="detail-chip">
                      OS: {visit.os || "Unknown"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-visits">No visits yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PublicStats;