import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo (2).png";
import userImg from "../assets/images/thumbs/user-img.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent the default link behavior

    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token');
      console.log("Attempting logout");

      // Call the logout API using fetch
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // This was missing the 'Bearer ' prefix
        }
        // No need to send an empty body - removed body: JSON.stringify({})
      });

      console.log("Response received:", response);

      if (!response.ok) {
        throw new Error(`Logout request failed: ${response.status}`);
      }

      // Clear user data from local storage
      localStorage.clear();
      console.log("Local storage cleared");

      // Redirect to sign-in page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to sign-in even if the API call fails
      localStorage.clear(); // Still clear storage even if API fails
      navigate('/login');
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
              {!isDashboardPage && !localStorage.getItem("token") && (
  <li><Link to="/login">Login & Register</Link></li>
)}
              <li><Link to="/contact">Contact</Link></li>
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

                  // Set button text to "Checking..." while verification is in progress
                  // You'll need to add state for this if you want to show loading state

                  // Verify token with backend
                  const response = await fetch('http://localhost:5500/api/auth/verifyToken', {
                    method: 'POST',
                    headers: {
                      'auth': `${token}`
                    }
                  });

                  if (response.ok) {
                    navigate("/dashboard");
                  } else {
                    localStorage.removeItem("token"); // Clear invalid token
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
                              to="#" // Changed to # so we can use our custom handler
                              onClick={handleLogout}
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