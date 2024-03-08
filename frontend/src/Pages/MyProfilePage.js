import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyProfilePage = ({ staffId }) => {
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/admin/${staffId}`);
        if (response.ok) {
          const data = await response.json();
          setAdminData(data);
          console.log(adminData);
          console.log("Fetched admin data:", data);
        } else {
          console.error("Error fetching admin data");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchAdminData();
  }, [staffId]);

  return (
    <div className="container mt-4">
      <h2>My Profile</h2>
      
      {adminData.staffId && (
        <div className="profile-container">
          <img
            src={`http://localhost:3001/${adminData.profilePic}`}
            alt="Profile Pic"
            className="profile-pic"
          />
          <div className="profile-info">
            <p>
              <strong>Staff ID:</strong> {adminData.staffId}
            </p>
            <p>
              <strong>First Name:</strong> {adminData.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {adminData.lastName}
            </p>
            <p>
              <strong>Username:</strong> {adminData.username}
            </p>
           <Link to="/editProfile" className="btn btn-secondary">
          Edit Profile
        </Link>
          </div>
       
        </div>
        
      )}
    </div>
  );
};

export default MyProfilePage;
