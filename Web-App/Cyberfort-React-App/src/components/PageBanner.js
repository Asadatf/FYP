import React from 'react';
import { Link } from 'react-router-dom';
import pageBanner from '../assets/images/page-banner.jpg';

const PageBanner = ({ title, breadcrumbs }) => {
  return (
    <div className="section page-banner-section" style={{backgroundImage: `url(${pageBanner})`}}>
      <div className="shape-2"></div>
      <div className="container">
        <div className="page-banner-wrap">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-banner text-center">
                <h2 className="title">{title}</h2>
                <ul className="breadcrumb justify-content-center">
                  {breadcrumbs.map((item, index) => (
                    <li key={index} className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}>
                      {index === breadcrumbs.length - 1 ? (
                        <span>{item.label}</span>
                      ) : (
                        <Link to={item.path}>{item.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBanner;