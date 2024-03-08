import React, { useState, useEffect ,useRef} from "react";
import { Form, Button } from "react-bootstrap";
import { Toast } from "primereact/toast";

const EditProfilePage = ({ staffId }) => {
const toast = useRef(null);
  const [newImage, setNewImage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    profilePic: null,
  });

  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/admin/${staffId}`);
        
        if (response.ok) {
          const data = await response.json();
          setAdminData(data);
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: data.password, 
            profilePic: data.profilePic, // Keep the profile picture unchanged by default
          });
         
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

  const showSuccessToast = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Profile successfully edited",
      life: 5000,
    });
  };

  const showErrorToast = (errorMessage) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage || "Failed to edit profile",
      life: 5000,
    });
  }
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
  
    if (imageFile) {
      setFormData((prevData) => {
        console.log("Previous Data:", prevData);
  
        const newData = {
          ...prevData,
          profilePic: imageFile,
        };
  
        console.log("New Data:", newData);
  
        return newData;
      });
  
      setNewImage(URL.createObjectURL(imageFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

    const form = new FormData();
    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("username", formData.username);
    form.append("profilePic", formData.profilePic);
    console.log("Form Data:", form);
    
      const response = await fetch(
        `http://localhost:3001/admin/editProfile/${staffId}`,
        {
          method: "PUT",
          body: form,
        }
      );

      if (response.ok) {
        console.log("Admin profile updated successfully");
        showSuccessToast();
        // Handle success, e.g., show a success message or redirect
      } else {
        const errorData = await response.json();
        console.error("Error updating admin profile:", errorData.error);
        showErrorToast();
      }
    } catch (error) {
      console.error("Error updating admin profile:", error);
    }
  };

  return (
    <div>
      <h2>Edit My Profile</h2>
      <div className="edit-profile-container mt-4">
        <div className="row">
          <div className="col-md-3 image-preview-container">
            <img
              src={
                newImage
                  ? newImage
                  : `http://localhost:3001/${adminData.profilePic}`
              }
              alt="profile img"
              style={{ width: "200px" }}
            />
          </div>
          <div className="col">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group> */}

              <Form.Group className="mb-3" controlId="profilePic">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="profilePic"
                  onChange={handleImageChange}
                />
              </Form.Group>

              <Button variant="secondary" type="submit" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </div>

  );
};

export default EditProfilePage;
