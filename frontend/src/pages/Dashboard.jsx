import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import Loader from "../components/Loader";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  const tokenHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchUrls = async () => {
  try {
    setLoading(true);

    const res = await axios.get(
      "https://snip-url-shortener-f8zm.onrender.com/api/url/my-urls",
      tokenHeader()
    );

    setUrls(res.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  const createUrl = async () => {
    try {
      if (!originalUrl.trim()) {
        setMessage("Please enter a URL");
        return;
      }

      const res = await axios.post(
        "https://snip-url-shortener-f8zm.onrender.com/api/url/create",
        { originalUrl, customAlias, expiresAt },
        tokenHeader()
      );

      setMessage(res.data.message);
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
      fetchUrls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create URL");
    }
  };

  const copyUrl = async (shortCode) => {
    const shortUrl = `https://snip-url-shortener-f8zm.onrender.com/api/url/${shortCode}`;
    await navigator.clipboard.writeText(shortUrl);

    setCopiedCode(shortCode);

    setTimeout(() => {
      setCopiedCode("");
    }, 2000);
  };

  const editUrl = async (url) => {
    const newUrl = prompt("Enter new destination URL", url.originalUrl);
    if (!newUrl) return;

    try {
      await axios.put(
        `https://snip-url-shortener-f8zm.onrender.com/api/url/${url._id}`,
        { originalUrl: newUrl },
        tokenHeader()
      );

      setMessage("URL updated successfully");
      fetchUrls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update URL");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://snip-url-shortener-f8zm.onrender.com/api/url/${deleteId}`,
        tokenHeader()
      );

      setMessage("URL deleted successfully");
      setDeleteId(null);
      fetchUrls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete URL");
    }
  };

  const uploadCSV = async () => {
    try {
      if (!csvFile) {
        setMessage("Please select a CSV file");
        return;
      }

      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await axios.post(
        "https://snip-url-shortener-f8zm.onrender.com/api/url/bulk",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(`${res.data.count} URLs created successfully`);
      setCsvFile(null);
      fetchUrls();
    } catch (error) {
      setMessage(error.response?.data?.message || "CSV upload failed");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if (file && file.name.endsWith(".csv")) {
      setCsvFile(file);
    } else {
      setMessage("Please upload a valid CSV file");
    }
  };

  const downloadQR = (shortCode) => {
    const canvas = document.getElementById(`qr-${shortCode}`);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `snip-${shortCode}.png`;
    link.click();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

 const filteredUrls = urls.filter((url) => {
  const text = searchText.trim().toLowerCase();

  const original = url.originalUrl?.toLowerCase() || "";
  const short = url.shortCode?.toLowerCase() || "";

  return original.includes(text) || short.includes(text);
});

if (loading) {
  return <Loader text="Loading your dashboard..." />;
}
  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <h2>Snip</h2>
        </div>

        <button className="logout-btn" onClick={logout}>
          Sign out
        </button>
      </nav>

      <main className="dashboard-main">
        <section className="hero-section">
          <div className="hero-left">
            <p className="eyebrow">Private dashboard</p>
            <h1>Your links</h1>
            <p className="subtitle">
              Create, manage, track and analyze your short URLs from one place.
            </p>
          </div>

          <div className="hero-search">
           
            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search by URL or short code..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          
          </div>
        </section>

        <section className="create-card">
          <div className="input-group">
            <label>Long URL</label>
            <input
              type="text"
              placeholder="https://example.com/very/long/path"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>
              Custom alias <span>optional</span>
            </label>
            <input
              type="text"
              placeholder="my-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>
              Expiry date <span>optional</span>
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <button className="shorten-btn" onClick={createUrl}>
            Shorten URL
          </button>
        </section>

         {message && (
          <div className="toast">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="csv-card">
          <div className="csv-info">
            <p className="eyebrow">Bulk upload</p>
            <h3>Shorten URLs from CSV</h3>
            <p>
              Upload a CSV file with a column named <b>url</b>.
            </p>
          </div>

          <label
            htmlFor="csvUpload"
            className={dragActive ? "custom-upload active" : "custom-upload"}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="upload-icon">↑</div>

            <div className="upload-content">
              <h4>{csvFile ? csvFile.name : "Choose or drop CSV"}</h4>
              <p>{csvFile ? "Ready to upload" : "Only .csv files are supported"}</p>
            </div>

            <input
              id="csvUpload"
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              hidden
            />
          </label>

          <button className="csv-upload-btn" onClick={uploadCSV}>
            Upload CSV
          </button>
        </section>

       

        <section className="links-card">
          {urls.length === 0 ? (
            <div className="empty-state">
              <h3>No links yet</h3>
              <p>Create your first short URL to start tracking clicks and analytics.</p>
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="empty-state">
              <h3>No matching links</h3>
              <p>Try searching with another short code or original URL.</p>
            </div>
          ) : (
            filteredUrls.map((url) => {
              const shortUrl = `https://snip-url-shortener-f8zm.onrender.com/api/url/${url.shortCode}`;

              return (
                <div className="link-row" key={url._id}>
                  <div className="link-info">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="short-link"
                    >
                      {shortUrl}
                    </a>

                    <p className="original-url">{url.originalUrl}</p>

                    <p className="meta">
                      Created {new Date(url.createdAt).toLocaleDateString()} ·{" "}
                      {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                      {url.expiresAt &&
                        ` · Expires ${new Date(url.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>

                  <div className="qr-section">
                    <div className="qr-box">
                      <QRCodeCanvas
                        id={`qr-${url.shortCode}`}
                        value={shortUrl}
                        size={92}
                      />
                    </div>

                    <button
                      className="download-qr-btn"
                      onClick={() => downloadQR(url.shortCode)}
                    >
                      Download QR
                    </button>
                  </div>

                  <div className="actions">
                    <button
                      className={
                        copiedCode === url.shortCode
                          ? "icon-btn copied-btn"
                          : "icon-btn"
                      }
                      onClick={() => copyUrl(url.shortCode)}
                    >
                      {copiedCode === url.shortCode ? "✓ Copied" : "Copy"}
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/stats/${url.shortCode}`)}
                    >
                      Public
                    </button>

                    <button className="icon-btn" onClick={() => editUrl(url)}>
                      Edit
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/analytics/${url._id}`)}
                    >
                      Analytics
                    </button>

                    <button
                      className="delete-icon-btn"
                      onClick={() => setDeleteId(url._id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      {deleteId && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-icon">!</div>
            <h2>Delete this link?</h2>
            <p>
              This action cannot be undone. The short URL and its analytics will
              be permanently removed.
            </p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteId(null)}>
                Cancel
              </button>

              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;