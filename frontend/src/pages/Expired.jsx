import { Link } from "react-router-dom";
import "./Expired.css";

function Expired() {
  return (
    <div className="expired-page">
      <div className="expired-card">

        <div className="expired-line"></div>

        <h1>Link Expired</h1>

        <p>
          This short link is no longer available.
          The expiration date has passed.
        </p>

        <Link to="/" className="expired-primary-btn">
          Return Home
        </Link>

      </div>
    </div>
  );
}

export default Expired;