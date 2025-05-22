import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageBanner from "../components/PageBanner";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [signupData, setSignupData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Form status state
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupshowPassword, setsignupShowPassword] = useState(false);
  const [csignupshowPassword, setcsignupShowPassword] = useState(false);

  // Add this effect to prevent back navigation after logout
  useEffect(() => {
    // This prevents back button navigation after logout
    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    // Check if user came from logout
    const params = new URLSearchParams(window.location.search);
    const loggedOut = params.get("logged_out");

    if (loggedOut) {
      // Clear any authentication data
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } else {
      // Check if user is already logged in
      const token = localStorage.getItem("token");
      if (token) {
        // Redirect to dashboard if token exists
        navigate("/dashboard", { replace: true });
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Handle login input changes
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle signup input changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  // Validate login form
  const validateLoginForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!loginData.email) {
      tempErrors.email = "Email is required";
      alert(tempErrors.email);
      isValid = false;
      navigate("/login");
      window.location.reload();
      return;
    }

    if (!loginData.password) {
      tempErrors.password = "Password is required";
      alert(tempErrors.password);
      isValid = false;
      navigate("/login");
      window.location.reload();
      return;
    }
    return isValid;
  };

  // Validate signup form
  const validateSignupForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!signupData.email) {
      console.log(signupData.email);
      tempErrors.email = "Email is required";
      alert(tempErrors.email);
      console.log(tempErrors.email);
      isValid = false;
      navigate("/login");
      window.location.reload();
      return;
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      tempErrors.email = "Email is invalid";
      console.log(tempErrors.email);
      alert(tempErrors.email);
      isValid = false;
      navigate("/login");
      window.location.reload();
      return;
    }

    if (!signupData.username) {
      console.log(signupData.username);
      tempErrors.username = "Username is required";
      alert(tempErrors.username);
      console.log(tempErrors.username);
      isValid = false;
      navigate("/login");
      window.location.reload();
      return;
    }

    if (!signupData.password) {
      console.log(signupData.password);
      tempErrors.password = "Password is required";
      console.log(tempErrors.password);
      alert(tempErrors.password);
      isValid = false;
      navigate("/login");
      window.location.reload();
      return;
    } else if (signupData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      console.log(tempErrors.password);
      alert(tempErrors.password);
      isValid = false;
      navigate("/login");
      window.location.reload();
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords don't match";
      console.log(tempErrors.confirmPassword);
      alert(tempErrors.confirmPassword);
      isValid = false;
      navigate("/login");
      window.location.reload();
      return;
    }
    return isValid;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    console.log("signup called");

    // Validate form
    if (!validateSignupForm()) {
      return;
    }

    setIsSignupLoading(true);

    try {
      const response = await fetch(
        "https://fyp-backend-gamma-flax.vercel.app//api/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signupData.email,
            username: signupData.username,
            password: signupData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert(error);
      setIsSignupLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateLoginForm()) {
      return;
    }

    setIsLoginLoading(true);

    try {
      const response = await fetch(
        "https://fyp-backend-gamma-flax.vercel.app//api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      } else {
        console.log("successfully logged in");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Redirect to dashboard with replace:true to prevent back button
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      window.location.reload();
      return;
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      <PageBanner
        title="Login"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Login", path: "/login" },
        ]}
      />
      {/* // Login & Register Start */}
      <div className="section login-register-section section-padding">
        <div className="container">
          {/* Login & Register Wrapper Start */}
          <div className="login-register-wrap">
            <div className="row gx-5">
              <div className="col-lg-6">
                {/* Login Box Start */}
                <div className="login-register-box">
                  {/* Section Title Start */}
                  <div className="section-title">
                    <h2 className="title">Login</h2>
                  </div>
                  {/* Section Title End */}

                  <div className="login-register-form">
                    <form onSubmit={handleLoginSubmit}>
                      <div className="single-form">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                        />
                      </div>
                      <div className="single-form">
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            {showPassword ? (
                              // Eye-slash icon when password is visible
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                              </svg>
                            ) : (
                              // Eye icon when password is hidden
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="single-form form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={loginData.rememberMe}
                          onChange={handleLoginChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>
                      <div className="form-btn">
                        <button
                          type="submit"
                          className="btn btn-main"
                          disabled={isLoginLoading}
                        >
                          {isLoginLoading ? "Logging in..." : "Login"}
                        </button>
                      </div>
                      <div className="single-form">
                        <p>
                          <a href="#">Lost your password?</a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
                {/* Login Box End */}
              </div>

              <div className="col-lg-6">
                {/* Register Box Start */}
                <div className="login-register-box">
                  {/* Section Title Start */}
                  <div className="section-title">
                    <h2 className="title">Register</h2>
                  </div>
                  {/* Section Title End */}

                  <div className="login-register-form">
                    <form onSubmit={handleSignupSubmit}>
                      <div className="single-form">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                          value={signupData.email}
                          onChange={handleSignupChange}
                        />
                      </div>
                      <div className="single-form">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Username"
                          name="username"
                          value={signupData.username}
                          onChange={handleSignupChange}
                        />
                      </div>
                      <div className="single-form">
                        <div style={{ position: "relative" }}>
                          <input
                            type={signupshowPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Password"
                            name="password"
                            value={signupData.password}
                            onChange={handleSignupChange}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setsignupShowPassword(!signupshowPassword)
                            }
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            {signupshowPassword ? (
                              // Eye-slash icon when password is visible
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                              </svg>
                            ) : (
                              // Eye icon when password is hidden
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="single-form">
                        <div style={{ position: "relative" }}>
                          <input
                            type={csignupshowPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={signupData.confirmPassword}
                            onChange={handleSignupChange}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setcsignupShowPassword(!csignupshowPassword)
                            }
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            {csignupshowPassword ? (
                              // Eye-slash icon when password is visible
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                              </svg>
                            ) : (
                              // Eye icon when password is hidden
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="form-btn">
                        <button
                          type="submit"
                          className="btn btn-main"
                          disabled={isSignupLoading}
                        >
                          {isSignupLoading ? "Registering..." : "Register"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {/* Register Box End */}
              </div>
            </div>
          </div>
          {/* Login & Register Wrapper End */}
        </div>
      </div>
      {/* // Login & Register End */}
    </>
  );
};

export default Login;
