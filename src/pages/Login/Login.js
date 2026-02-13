import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = "https://qr-dine-backend-xbja.onrender.com/api/";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API + "login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save JWT + role
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("role", data.role);
      localStorage.setItem("restaurant_name", data.restaurant_name);

      // Role based redirect
      if (data.role === "owner") {
        navigate("/owner");
      } else if (data.role === "kitchen") {
        navigate("/kitchen");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>🍽 Restaurant Control Panel</h1>
          <p>Secure staff access</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="error-msg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}
