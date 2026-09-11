import { useState } from "react";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="login-card">

        <div className="login-icon">
          <LockKeyhole size={24} />
        </div>

        <h1>Welcome back</h1>

        <p className="login-subtitle">
          Sign in to manage your portfolio.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <div className="input-box">
            <Mail size={18} />
            <input
              type="email"
              placeholder="admin@portfolio.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-box">
            <LockKeyhole size={18} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <button
          className="back-home"
          onClick={() => navigate("/")}
        >
          ← Back to portfolio
        </button>

      </div>
    </div>
  );
}

export default AdminLogin;