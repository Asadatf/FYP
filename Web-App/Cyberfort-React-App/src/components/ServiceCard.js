import React from 'react';


const ServiceCard = ({ title, icon, description }) => (
    <div className="col-lg-4 col-md-6">
      <div className="service-item text-center">
        <div className="shape-1">
          <img src="assets/images/home10/ser-shape1.png" alt="" />
        </div>
        <div className="service-icon">
          <img src={icon} alt={title} />
        </div>
        <div className="service-content">
          <h3 className="title"><a href="#">{title}</a></h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );

export default ServiceCard;