import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "./Auth.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: form.password.length >= 8
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(form.password)
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(form.password)
    },
    {
      label: "One number",
      valid: /[0-9]/.test(form.password)
    },
    {
      label: "One special symbol",
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(form.password)
    }
  ];

  const isPasswordStrong = passwordRules.every((rule) => rule.valid);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordStrong) {
      setMessage("Please create a stronger password.");
      return;
    }

    try {
      const res = await axios.post(
        "https://snip-url-shortener-f8zm.onrender.com/api/auth/signup",
        form
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSignup = async () => {
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
      setMessage("Google signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-heading">
        <h1>Create account</h1>
        <p>
          Already have an account? <Link to="/login">Sign in now</Link>
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
          onClick={handleGoogleSignup}
        >
          <FcGoogle className="google-icon" />
          Continue with Google
        </button>

        <div className="divider">
          <span></span>
          <p>or continue with email</p>
          <span></span>
        </div>

        {message && <p className="auth-message">{message}</p>}

        <label>Name <b>*</b></label>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
        />

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
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
        />

        <div className="password-box">
          <div className="password-top">
            <span>Password strength</span>
            <b className={isPasswordStrong ? "strong-text" : "weak-text"}>
              {isPasswordStrong ? "Strong" : "Weak"}
            </b>
          </div>

          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{
                width: `${
                  (passwordRules.filter((rule) => rule.valid).length / 5) * 100
                }%`
              }}
            ></div>
          </div>

          <ul className="password-rules">
            {passwordRules.map((rule, index) => (
              <li key={index} className={rule.valid ? "rule-valid" : "rule-invalid"}>
                <span>{rule.valid ? "✓" : "×"}</span>
                {rule.label}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={!isPasswordStrong}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Signup;