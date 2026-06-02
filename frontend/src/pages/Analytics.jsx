import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Analytics.css";

function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/url/analytics/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getChartData = () => {
    const days = [];

    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });

      const count = data.recentVisits.filter((visit) =>
        visit.visitedAt.startsWith(key)
      ).length;

      days.push({
        date: label,
        clicks: count,
      });
    }

    return days;
  };

  if (!data) {
  return <Loader text="Loading analytics..." />;
}
  const shortUrl = `http://localhost:5000/api/url/${data.shortCode}`;

  return (
    <div className="analytics-page">
      <nav className="analytics-nav">
        <div className="analytics-brand">
          <div className="brand-icon">🔗</div>
          <h2>Snip</h2>
        </div>
      </nav>

      <main className="analytics-main">
        <Link to="/dashboard" className="back-link">
          ← Back
        </Link>

        <h1>Link analytics</h1>

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
            <p>Last visited</p>
            <h2>
              {data.lastVisited
                ? new Date(data.lastVisited).toLocaleString()
                : "—"}
            </h2>
          </div>

          <div className="stat-card">
            <p>Short code</p>
            <h2>{data.shortCode}</h2>
          </div>
        </div>

        <div className="chart-card">
          <h3>Last 14 days</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#6865ff" />
            </LineChart>
          </ResponsiveContainer>
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

export default Analytics;