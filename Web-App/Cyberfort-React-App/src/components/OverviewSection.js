import React from 'react';


const OverviewSection = () => (
    <div className="section overview-section-5 section-padding">
      <div className="container">
        <div className="overview-wrap">
          <div className="row">
            <div className="col-xl-7 col-lg-6">
              <div className="overview-img">
                <img className="shape-1" src="assets/images/home10/over-shape1.png" alt="" />
                <div className="image">
                  <img src="assets/images/home10/over-img1.png" alt="" />
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div className="overview-content">
                <div className="section-title2">
                  <h2 className="title white">best solution for All native Devices</h2>
                </div>
                <p className="text">Accelerate innovation with world-class tech teams.</p>
                <div className="overview-list">
                  <ul>
                    <div className="row">
                      {["Complete Security", "Security Management", "Malware Detection", "Identifying Threats"].map((item, index) => (
                        <div key={index} className="col-md-6">
                          <li>
                            <span className="overview-icon"><i className="fas fa-check"></i></span>
                            <span className="overview-text">{item}</span>
                          </li>
                        </div>
                      ))}
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  export default OverviewSection;