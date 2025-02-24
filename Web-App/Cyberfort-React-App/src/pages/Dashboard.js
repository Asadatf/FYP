import React, { useState } from 'react';
import userImg from '../asset/images/thumbs/user-img.png';
import titleBackground from '../assets/images/titleBackground.jpeg.jpg';
import phishingThumbnail from '../assets/images/phishing_thumbnail.jpg';
import logo from '../assets/images/logo (2).png';


const Dashboard = () => {
  const [userData] = useState({
    name: 'Asad Tariq',
    email: 'asad@mail.com'
  });

  const games = [
    {
      id: 1,
      title: 'Network Defender',
      image: '/assets/images/titleBackground.jpeg.jpg',
      url: '../NetworkDefender/NetworkDefender-rafed/index.html'
    },
    {
      id: 2,
      title: 'Phishing Awareness',
      image: '/assets/images/phishing_thumbnail.jpg',
      url: '../Phishing_game/PhishingAwareness/index.html'
    }
  ];

  return (
    <>
      <div class="dashboard-main-wrapper">
        <div class="top-navbar flex-between gap-16">
          <div class="header-logo header-logo-3">
            <a className="logo-white" href="index.html"><img src={logo} alt="Logo" /></a>
          </div>
          <div class="flex-align gap-16">


            <div class="header-menu d-none d-lg-block">
              <ul class="main-menu">
                <li class="active-menu"><a href="index.html">Home</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>


          </div>






          <div className="flex-align gap-16">
            {/* User Profile Start */}
            <div className="dropdown">
              <button
                className="users arrow-down-icon border border-gray-200 rounded-pill p-4 d-inline-block pe-40 position-relative"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="position-relative">
                  <img
                    src={userImg}
                    alt="User"
                    className="h-32 w-32 rounded-circle"
                  />
                  <span
                    className="activation-badge w-8 h-8 position-absolute inset-block-end-0 inset-inline-end-0"
                  />
                </span>
              </button>

              <div className="dropdown-menu dropdown-menu--lg border-0 bg-transparent p-0">
                <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                  <div className="card-body">
                    <div className="flex-align gap-8 mb-20 pb-20 border-bottom border-gray-100">
                      <img
                        src={userImg}
                        alt="User profile"
                        className="w-54 h-54 rounded-circle"
                      />
                      <div>
                        <h4 className="mb-0">Asad Tariq</h4>
                        <p className="fw-medium text-13 text-gray-200">asad@mail.com</p>
                      </div>
                    </div>

                    <ul className="max-h-270 overflow-y-auto scroll-sm pe-4">
                      <li className="mb-4">
                        <a
                          href="setting.html"
                          className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                        >
                          <span className="text-2xl text-primary-600 d-flex">
                            <i className="ph ph-gear"></i>
                          </span>
                          <span className="text">Account Settings</span>
                        </a>
                      </li>
                      <li className="pt-8 border-top border-gray-100">
                        <a
                          href="sign-in.html"
                          className="py-12 text-15 px-20 hover-bg-danger-50 text-gray-300 hover-text-danger-600 rounded-8 flex-align gap-8 fw-medium text-15"
                        >
                          <span className="text-2xl text-danger-600 d-flex">
                            <i className="ph ph-sign-out"></i>
                          </span>
                          <span className="text">Log Out</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* User Profile End */}
          </div>
        </div>


        <div className="dashboard-body">
          <div className="row gy-4">
            <div className="col-lg-9">
              {/* Widgets End */}

              {/* Top Course Start */}
              <div className="card mt-24">
                <div className="card-body">
                  <div className="mb-20 flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Hello, Asad Tariq</h4>
                  </div>

                  <div className="row g-20">
                    <div className="col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a href="#" className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8">
                            <img src={titleBackground} alt="Course Image" />
                          </a>
                          <div className="p-8">
                            <h5 className="mb-0">
                              <a href="#" className="hover-text-main-600">Network Defender</a>
                            </h5>
                            <div className="flex-between gap-4 flex-wrap mt-24">
                              <a
                                href="../NetworkDefender/NetworkDefender-rafed/index.html"
                                className="btn btn-main rounded-pill py-9"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Play Game
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-20">
                    <div className="col-lg-4 col-sm-6">
                      <div className="card border border-gray-100">
                        <div className="card-body p-8">
                          <a href="#" className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8">
                            <img src={phishingThumbnail} alt="Course Image" />
                          </a>
                          <div className="p-8">
                            <h5 className="mb-0">
                              <a href="#" className="hover-text-main-600">Phishing Awareness</a>
                            </h5>
                            <div className="flex-between gap-4 flex-wrap mt-24">
                              <a
                                href="../Phishing_game/PhishingAwareness/index.html"
                                className="btn btn-main rounded-pill py-9"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Play Game
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Top Course End */}
            </div>

            <div className="col-lg-3">
              {/* Progress Bar Start */}
              <div className="card mt-24">
                <div className="card-header border-bottom border-gray-100">
                  <h5 className="mb-0">My Progress</h5>
                </div>
                <div className="card-body">
                  <div id="radialMultipleBar"></div>

                  <div className="">
                    <h6 className="text-lg mb-16 text-center">
                      <span className="text-gray-400">Total hour:</span> 6h 32 min
                    </h6>
                    <div className="flex-between gap-8 flex-wrap">
                      <div className="flex-align flex-column">
                        <h6 className="mb-6">60/60</h6>
                        <span className="w-30 h-3 rounded-pill bg-main-600"></span>
                        <span className="text-13 mt-6 text-gray-600">Completed</span>
                      </div>
                      <div className="flex-align flex-column">
                        <h6 className="mb-6">60/60</h6>
                        <span className="w-30 h-3 rounded-pill bg-main-two-600"></span>
                        <span className="text-13 mt-6 text-gray-600">Completed</span>
                      </div>
                      <div className="flex-align flex-column">
                        <h6 className="mb-6">60/60</h6>
                        <span className="w-30 h-3 rounded-pill bg-gray-500"></span>
                        <span className="text-13 mt-6 text-gray-600">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Progress bar end */}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Dashboard;