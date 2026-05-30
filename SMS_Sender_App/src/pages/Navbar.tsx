import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Navbar.css";
import { Button, Modal, Tooltip } from "antd";
import { LeftOutlined } from "@ant-design/icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const showBackBtn = location.pathname !== "/";

  const handleLogout = () => {
    Modal.confirm({
      title: "Send Message?",
      content: "Are your sure you want to logout?",
      okText: "Logout",
      cancelText: "Cancel",
      okType: "primary",
      onOk() {
        logout();
        navigate("/login");
      },
    });
  };
  return (
    <>
      <header className="navbar">
        <div className="navbar__container">
          {showBackBtn ? (
            <div>
              <Tooltip title="Go Back">
                <Button
                  type="text"
                  shape="circle"
                  icon={
                    <LeftOutlined
                      style={{
                        color: "#f8fafc",
                        fontSize: 18,
                      }}
                    />
                  }
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center hover:bg-white/10"
                />
              </Tooltip>
            </div>
          ) : null}
          {/* Brand */}
          <div className="navbar__brand" style={{ cursor: "pointer" }}>
            <div className="navbar__brand-icon">S</div>
            <div className="navbar__brand-title">
              <span>SMS Sender</span>
              <h1>Pulse</h1>
            </div>
          </div>

          {/* Desktop Links */}
          {user && (
            <nav className="navbar__links">
              <span
                className="navbar__link cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>
              <span
                className="navbar__link cursor-pointer"
                onClick={() => navigate("/send-msg")}
              >
                Send SMS
              </span>
              <span
                className="navbar__link cursor-pointer"
                onClick={() => navigate("/about")}
              >
                About
              </span>
            </nav>
          )}

          {/* Right Side */}
          {user && (
            <div className="navbar__actions">
              {/* User Info */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  {user.role}
                </div>
              </div>

              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--panel)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Logout */}
              <button className="button--primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          {/* Mobile Toggle */}
          <button className="menu-toggle" onClick={() => setOpen(!open)}>
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`nav-menu ${open ? "active" : ""}`}>
        {user && (
          <>
            <span
              className="nav-menu__link"
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
            >
              Dashboard
            </span>

            <span
              className="nav-menu__link"
              onClick={() => {
                navigate("/send-msg");
                setOpen(false);
              }}
            >
              Send SMS
            </span>

            <span
              className="nav-menu__link"
              onClick={() => {
                navigate("/about");
                setOpen(false);
              }}
            >
              About
            </span>

            <div className="nav-menu__footer">
              <button className="button--primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
