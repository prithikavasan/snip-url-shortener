import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Password reset failed"
      );
    }
  };

 return (
  <div className="reset-page">
    <form className="reset-card" onSubmit={handleReset}>
      <div className="reset-logo">
        <div className="reset-logo-icon">S</div>
        <h2>Snip</h2>
      </div>

      <h1 className="reset-title">
        Reset Password
      </h1>

      <p className="reset-subtitle">
        Create a new secure password for your account.
      </p>

      <div className="reset-input-group">
        <label>New Password</label>

        <input
          className="reset-input"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="reset-btn"
      >
        Reset Password
      </button>

      {message && (
        <div className="reset-message">
          {message}
        </div>
      )}
    </form>
  </div>
);
}
export default ResetPassword;