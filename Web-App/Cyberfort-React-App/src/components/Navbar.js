import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo (2).png';

const Navbar = () => {
  return (
    <div id="header" className="section header-section transparent-header">
      <div className="container">
        <div className="header-wrap">
          <div className="header-logo">
            <Link to="/">
            <img src={logo} alt="CyberBit" />
            </Link>
          </div>
          <div className="header-menu d-none d-lg-block">
            <ul className="main-menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/login">Login & Register</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="header-btn-2 d-none d-xl-block">
            <Link className="btn" to="/dashboard">Start Learning</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
