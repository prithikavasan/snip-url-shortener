import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
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
    return <Loader text="Loading public stats..." />;
  }

  const shortUrl = `https://snip-url-shortener-f8zm.onrender.com/api/url/${data.shortCode}`;

  return (
    <div className="analytics-page">
      <nav className="analytics-nav">
        <div className="analytics-brand">
          <div className="brand-icon">S</div>
          <h2>Snip</h2>
        </div>
      </nav>

      <main className="analytics-main">
        <Link to="/" className="back-link">
          ← Home
        </Link>

        <h1>Public link stats</h1>

        <div className="url-line">
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
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
          <h3>Public summary</h3>

          <div className="visit-card">
            <p className="no-visits">
              This page shows only public summary details. Detailed analytics
              like browser, OS, device and recent visits are visible only to the
              link owner.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PublicStats;