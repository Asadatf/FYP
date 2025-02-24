import React from 'react';
import contactBg from '../assets/images/home10/contact-bg.jpg';

const ContactSection = () => {
  return (
    <div 
      className="section contact-section contact-section-3 section-padding" 
      style={{backgroundImage: `url(${contactBg})`}}
    >
      <div className="container">
        {/* Contact Wrap Start */}
        <div className="contact-wrap">
          <div className="row">
            <div className="col-xl-5 col-lg-6">
              {/* Contact Info Start */}
              <div className="contact-info">
                <h3 className="info-title">Need a Quick Query?</h3>
                <ul>
                  <li>
                    {/* Contact Info Item Start */}
                    <div className="contact-info-item d-flex align-items-center">
                      <div className="contact-info-icon">
                        <i className="flaticon-phone-call"></i>
                      </div>
                      <div className="contact-info-text">
                        <h4 className="title">Contact Number</h4>
                        <p>+00(1) 123 456 7890</p>
                      </div>
                    </div>
                    {/* Contact Info Item End */}
                  </li>
                  <li>
                    {/* Contact Info Item Start */}
                    <div className="contact-info-item d-flex align-items-center">
                      <div className="contact-info-icon">
                        <i className="flaticon-email"></i>
                      </div>
                      <div className="contact-info-text">
                        <h4 className="title">Our Mail</h4>
                        <p>infotechmax@ourmail.com</p>
                      </div>
                    </div>
                    {/* Contact Info Item End */}
                  </li>
                  <li>
                    {/* Contact Info Item Start */}
                    <div className="contact-info-item d-flex align-items-center">
                      <div className="contact-info-icon">
                        <i className="flaticon-pin"></i>
                      </div>
                      <div className="contact-info-text">
                        <h4 className="title">Our Location</h4>
                        <p>Karachi, Pakistan</p>
                      </div>
                    </div>
                    {/* Contact Info Item End */}
                  </li>
                </ul>
              </div>
              {/* Contact Info End */}
            </div>
            <div className="col-xl-7 col-lg-6">
              {/* Contact Form Start */}
              <div className="contact-form">
                <div className="contact-form-wrap">
                  <div className="heading-wrap text-center">
                    <span className="sub-title">Leave us massage</span>
                    <h3 className="title">How May We Help You!</h3>
                  </div>
                  <form action="#">
                    <div className="row">
                      <div className="col-sm-6">
                        {/* Single Form Start */}
                        <div className="single-form">
                          <input type="text" placeholder="Name *" />
                        </div>
                        {/* Single Form End */}
                      </div>
                      <div className="col-sm-6">
                        {/* Single Form Start */}
                        <div className="single-form">
                          <input type="email" placeholder="Email *" />
                        </div>
                        {/* Single Form End */}
                      </div>
                      <div className="col-sm-12">
                        {/* Single Form Start */}
                        <div className="single-form">
                          <input type="text" placeholder="Subject *" />
                        </div>
                        {/* Single Form End */}
                      </div>
                      <div className="col-sm-12">
                        {/* Single Form Start */}
                        <div className="single-form">
                          <textarea placeholder="Write A Message"></textarea>
                        </div>
                        {/* Single Form End */}
                      </div>
                      <div className="col-sm-12">
                        {/* Single Form Start */}
                        <div className="form-btn">
                          <button className="btn" type="submit">Send Message</button>
                        </div>
                        {/* Single Form End */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* Contact Form End */}
            </div>
          </div>
        </div>
        {/* Contact Wrap End */}
      </div>
    </div>
  );
 };
  export default ContactSection;