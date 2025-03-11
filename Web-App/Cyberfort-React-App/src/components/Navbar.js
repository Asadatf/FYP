import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo (2).png";
import userImg from "../assets/images/thumbs/user-img.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Function to toggle dropdown
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
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              {!isDashboardPage && (
                <li><Link to="/login">Login & Register</Link></li>
              )}
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Conditionally Render Start Learning Button */}
          {!isDashboardPage && (
            <button className="btn btn-main" onClick={() => navigate("/dashboard")}>
              Start Learning
            </button>
          )}

          {/* Show User Profile only on Dashboard */}
          {isDashboardPage && (
            <div className="flex-align gap-16" ref={dropdownRef}>
              {/* User Profile Start */}
              <div className="dropdown">
                <button
                  className="users arrow-down-icon border border-gray-200 rounded-pill p-4 d-inline-block pe-40 position-relative"
                  type="button"
                  onClick={toggleDropdown} // Toggle dropdown on click
                >
                  <span className="position-relative">
                    <img src={userImg} alt="User" className="h-32 w-32 rounded-circle" />
                    <span className="activation-badge w-8 h-8 position-absolute inset-block-end-0 inset-inline-end-0"></span>
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu dropdown-menu--lg border-0 bg-transparent p-0 show">
                    <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                      <div className="card-body">
                        <div className="flex-align gap-8 mb-20 pb-20 border-bottom border-gray-100">
                          <img src={userImg} alt="User" className="w-54 h-54 rounded-circle" />
                          <div>
                            <h4 className="mb-0">Asad Tariq</h4>
                            <p className="fw-medium text-13 text-gray-200">asad@mail.com</p>
                          </div>
                        </div>

                        <ul className="max-h-270 overflow-y-auto scroll-sm pe-4">
                          <li className="pt-8">
                            <Link
                              to="/sign-in"
                              className="py-12 text-15 px-20 hover-bg-danger-50 text-gray-300 hover-text-danger-600 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                              <span className="text-2xl text-danger-600 d-flex">
                                <i className="ph ph-sign-out"></i>
                              </span>
                              <span className="text">Log Out</span>
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