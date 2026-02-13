import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./owner.css";

export default function OwnerLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <h2 className="logo">🍽 Admin Panel</h2>

        <nav>
          <NavLink to="/owner">Dashboard</NavLink>
          <NavLink to="/owner/menu">Menu</NavLink>
          <NavLink to="/owner/tables">Tables</NavLink>
          <NavLink to="/owner/orders">Orders</NavLink>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="main">
        <div className="topbar">
          Restaurant Admin
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
