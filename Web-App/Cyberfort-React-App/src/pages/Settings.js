// pages/Settings.js
import React, { useState } from 'react';

const Settings = () => {
  const [userDetails, setUserDetails] = useState({
    name: 'Asad Tariq',
    email: '',
    phone: '',
    profileImage: null,
    coverImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserDetails(prev => ({
          ...prev,
          [type]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving changes:', userDetails);
  };

  return (
    <div className="dashboard-body">
      <div className="card overflow-hidden">
        <div className="card-body p-0">
          <div className="setting-profile px-24">
            <form onSubmit={handleSubmit}>
              <div className="row gy-4">
                <div className="col-sm-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-primary">Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;