import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import JWT decode
import logo from "../assets/images/logo (2).png";
import userImg from "../assets/images/thumbs/user-img.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  const dropdownRef = useRef(null);

  // Load user info from token on component mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);

        // Extract email and user_id from the decoded token
        setUser({
          name: `User ${decoded.userId || ""}`, // Create placeholder name using user_id
          email: decoded.email || "",
        });
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log("Attempting logout");

      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response received:", response);

      if (!response.ok) {
        throw new Error(`Logout request failed: ${response.status}`);
      }

      localStorage.clear();
      console.log("Local storage cleared");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      navigate("/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <div id="header" className="section header-section transparent-header">
      <div className="container">
        <div className="header-wrap">
          {/* Logo */}
          <div className="header-logo">
            <Link to="/">
              <img src={logo} alt="CyberBit" />
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="header-menu d-none d-lg-block">
            <ul className="main-menu">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              {!isDashboardPage && (
                <li>
                  <Link to="/login">Login & Register</Link>
                </li>
              )}
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Conditionally Render Start Learning Button */}
          {!isDashboardPage && (
            <button
              className="btn btn-main"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");

                  if (!token) {
                    navigate("/login");
                    return;
                  }

                  // Verify token with backend
                  const response = await fetch(
                    "http://localhost:5500/api/auth/verifyToken",
                    {
                      method: "POST",
                      headers: {
                        auth: `${token}`,
                      },
                    }
                  );

                  if (response.ok) {
                    navigate("/dashboard");
                  } else {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }
                } catch (error) {
                  console.error("Error verifying token:", error);
                  navigate("/login");
                }
              }}
            >
              Start Learning
            </button>
          )}

          {/* Show User Profile only on Dashboard */}
          {isDashboardPage && (
            <div className="flex-align gap-16" ref={dropdownRef}>
              {/* User Profile Start */}
              <div className="dropdown">
                <button
                  className="users rounded-pill p-1 d-flex align-items-center position-relative"
                  style={{
                    background: "rgba(76, 111, 255, 0.15)",
                    border: "1px solid rgba(76, 111, 255, 0.3)",
                    paddingRight: "12px",
                    paddingLeft: "4px",
                  }}
                  type="button"
                  onClick={toggleDropdown}
                >
                  <span className="position-relative">
                    <img
                      src={userImg}
                      alt="User"
                      className="h-32 w-32 rounded-circle"
                      style={{
                        border: "2px solid rgba(76, 111, 255, 0.4)",
                      }}
                    />
                    <span
                      className="position-absolute"
                      style={{
                        width: "10px",
                        height: "10px",
                        background: "#4ade80",
                        borderRadius: "50%",
                        bottom: "0",
                        right: "0",
                        border: "1px solid white",
                      }}
                    ></span>
                  </span>
                  <i
                    className={`ph ${
                      dropdownOpen ? "ph-caret-up" : "ph-caret-down"
                    } text-white ms-2 fs-14`}
                    style={{ opacity: 0.8 }}
                  ></i>
                </button>

                {dropdownOpen && (
                  <div
                    className="dropdown-menu dropdown-menu--lg border-0 p-0 show"
                    style={{
                      right: 0,
                      marginTop: "10px",
                      boxShadow: "0 5px 30px rgba(0,0,0,0.25)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "white",
                    }}
                  >
                    <div className="card border-0">
                      <div
                        className="card-header p-3 text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #4c6fff, #6e54f7)",
                        }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="position-relative">
                            <img
                              src={userImg}
                              alt="User"
                              className="rounded-circle"
                              style={{
                                width: "48px",
                                height: "48px",
                                border: "2px solid rgba(255, 255, 255, 0.7)",
                              }}
                            />
                            <span
                              className="position-absolute"
                              style={{
                                width: "10px",
                                height: "10px",
                                background: "#4ade80",
                                borderRadius: "50%",
                                bottom: "2px",
                                right: "2px",
                                border: "1px solid white",
                              }}
                            ></span>
                          </div>
                          <div>
                            <h5 className="mb-0 fw-bold">CyberFort User</h5>
                            <p className="mb-0 opacity-75 fs-14">
                              {user.email || "user@cyberfort.com"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-0">
                        <ul className="list-group list-group-flush border-0">
                          <li className="list-group-item p-0 border-top">
                            <Link
                              to="#"
                              onClick={handleLogout}
                              className="d-flex align-items-center gap-2 p-3 text-decoration-none text-danger hover-bg-danger-50"
                            >
                              <i className="ph ph-sign-out fs-20"></i>
                              <span className="fw-medium">Log Out</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* User Profile End */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
