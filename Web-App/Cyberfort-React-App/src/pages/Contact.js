import React, { useState } from 'react';
import PageBanner from '../components/PageBanner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <PageBanner 
        title="Contact Us" 
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Contact Us', path: '/contact' }
        ]} 
      />

      <div className="section contact-info-section section-padding-02">
        <div className="container">
          <div className="contact-info-wrap">
            <div className="row">
              <div className="col-lg-4 col-sm-6">
                <div className="single-contact-info text-center">
                  <div className="info-icon">
                    <i className="flaticon-phone-call"></i>
                  </div>
                  <div className="info-content">
                    <h5 className="title">Telephone</h5>
                    <p>+458 123 657 2324</p>
                  </div>
                </div>
              </div>
              {/* Similar blocks for email and location */}
            </div>
          </div>
        </div>
      </div>

      <div className="section contact-form-section section-padding">
        <div className="container">
          <div className="contact-wrap">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="form-title text-center">
                  <h2 className="title">Get Support from our Team</h2>
                </div>
                <div className="contact-form-wrap">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="single-form">
                          <input 
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Your Name"
                          />
                        </div>
                      </div>
                      {/* Similar input fields for email, phone, subject */}
                      <div className="col-md-12">
                        <div className="single-form">
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Write A Message"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-btn text-center">
                          <button type="submit" className="btn">Send Message</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
