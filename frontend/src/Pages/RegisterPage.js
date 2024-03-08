import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../LoginPage.css";
import { Toast } from "primereact/toast";
import bg5 from "../Images/bg5.jpg";

const RegisterPage = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [newAdmin, setNewAdmin] = useState({
    staffId: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    profilePic: null,
  });

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      setNewAdmin((prevData) => ({
        ...prevData,
        profilePic: imageFile,
        profilePicPreview: URL.createObjectURL(imageFile),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewAdmin((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showSuccessToast = () => {
    console.log("showsuccesstoast is called");
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Successful registration",
      life: 5000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("staffId", newAdmin.staffId);
    formData.append("firstName", newAdmin.firstName);
    formData.append("lastName", newAdmin.lastName);
    formData.append("username", newAdmin.username);
    formData.append("password", newAdmin.password);
    formData.append("profilePic", newAdmin.profilePic);

    try {
      const response = await fetch("http://localhost:3001/admin/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Admin registered successfully");
        showSuccessToast();
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error("Error registering admin:", errorData.error);
      }
    } catch (error) {
      console.error("Error registering admin:", error);
    }
  };

  return (
    <div className="register-container">
      <Toast ref={toast} />
      <div className="wrapper">
        <div className="container main">
          <div className="row register-form-box">
            <div className="col-md-6 p-0 position-relative">
              <img
                src={bg5}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px 0 0 10px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Welcome to the <br />
                Product Management Dashboard
              </div>
            </div>
            <div className="col-md-6 right">
              <form onSubmit={handleSubmit}>
                <div className="input-box">
                  <header className="mt-3">Admin Registration</header>

                  <div className="input-field">
                    <input
                      type="text"
                      className="input"
                      name="staffId"
                      placeholder="Staff ID"
                      value={newAdmin.staffId}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-field">
                    <input
                      type="text"
                      className="input"
                      name="firstName"
                      placeholder="First Name"
                      value={newAdmin.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-field">
                    <input
                      type="text"
                      className="input"
                      name="lastName"
                      placeholder="Last Name"
                      value={newAdmin.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-field">
                    <input
                      type="text"
                      className="input"
                      name="username"
                      placeholder="Username"
                      value={newAdmin.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-field">
                    <input
                      type="password"
                      className="input"
                      name="password"
                      placeholder="Password"
                      value={newAdmin.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-field" style={{ width: "75%" }}>
                    <p>Profile Picture</p>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                    />
                  </div>

                  <button type="submit" className="submit w-75 mt-3">
                    Register
                  </button>
                  

                  <div className="sign-in">
                    <span>
                      Already have an account? <Link to={"/"}>Sign-In</Link>
                    </span>
                  </div>
                </div>
              </form>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
