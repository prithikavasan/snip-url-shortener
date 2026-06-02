import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://snip-url-shortener-f8zm.onrender.com/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      const res = await axios.post(
        "https://snip-url-shortener-f8zm.onrender.com/api/auth/google-login",
        {
          name: googleUser.displayName,
          email: googleUser.email
        }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (error) {
      setMessage("Google login failed");
    }
  };

 const handleForgotPassword = async () => {
  try {
    if (!form.email) {
      setMessage("Please enter your email first");
      return;
    }

    setForgotLoading(true);

    const res = await axios.post(
      "https://snip-url-shortener-f8zm.onrender.com/api/auth/forgot-password",
      {
        email: form.email
      }
    );

    setResetEmail(form.email);
    setMessage(res.data.message);
    setShowResetModal(true);

  } catch (error) {
    setMessage(
      error.response?.data?.message ||
      "Failed to send password reset link"
    );
  } finally {
    setForgotLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-heading">
        <h1>Welcome back</h1>
        <p>
          Don't have an account? <Link to="/signup">Create one now</Link>
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <div className="auth-logo-icon">S</div>
          <div>
            <h2>Snip</h2>
            <span>SMART LINKS</span>
          </div>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="google-icon" />
          Continue with Google
        </button>

        <div className="divider">
          <span></span>
          <p>or continue with email</p>
          <span></span>
        </div>

        {message && !showResetModal && (
          <p className="auth-message">{message}</p>
        )}

        <label>Email <b>*</b></label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange}
        />

        <label>Password <b>*</b></label>
        <input
          type="password"
          name="password"
          placeholder="Your secure password"
          value={form.password}
          onChange={handleChange}
        />

        <div className="forgot-row">
          <button
            type="button"
            className="forgot-btn"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="auth-submit">
          Sign In
        </button>
      </form>

      {showResetModal && (
        <div className="reset-modal-overlay">
          <div className="reset-modal">
            <div className="reset-success-icon">✓</div>

            <h2>Reset Link Sent</h2>

            <p>
              We have sent a password reset link to
              <br />
              <strong>{resetEmail}</strong>
            </p>

            <span>
              Please check your inbox and spam folder. The link will expire
              soon.
            </span>

            <button
              type="button"
              onClick={() => {
                setShowResetModal(false);
                setMessage("");
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {forgotLoading && (
  <div className="forgot-loading-overlay">
    <div className="forgot-loader"></div>
  </div>
)}
    </div>
  );
}

export default Login;