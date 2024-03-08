import React, { useState ,useRef,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../LoginPage.css";
import { useAuth } from "../AuthContext";
import { Toast } from "primereact/toast";
import bg5 from "../Images/bg5.jpg";

const LoginPage = ({ setLoggedIn, setStaffId }) => {
  const toast = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const showErrorToast = (errorMessage) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage || "Failed to login",
      life: 5000,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await setLoggedIn(true);
        localStorage.setItem('userInfo',JSON.stringify(data));
        navigate("/home");
        setStaffId(data.staffId);
        setToken(data.token);

        // Redirect to the authenticated route or perform any other action
      } else {
        const errorData = await response.json();
        showErrorToast("Incorrect username or password");
        console.error("Login failed:", errorData.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setLoggedIn(true);
      setStaffId(userInfo.staffId);
      setToken(userInfo.token);
      navigate("/home");
    }
  }, [navigate, setLoggedIn, setStaffId, setToken]);

  return (
    <div className="wrapper">
      <div className=" main">
        <div className="row login-form-box">
          <div className="col-md-6 p-0 position-relative">
            <img
              src={bg5}
              alt=""
              style={{
                width: "100%",
                maxHeight: "80vh",
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
            <form onSubmit={handleLogin}>
              <div className="input-box">
                <header>Login</header>
                <div className="input-field">
                  <input
                    type="text"
                    className="input"
                    id="username"
                    required=""
                    autoComplete="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="username">Username</label>
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    className="input"
                    id="pass"
                    required=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="pass">Password</label>
                </div>
                <div className="input-field">
                  <input type="submit" className="submit" value="Login" />
                </div>
                <div className="register">
                  <span>
                    Do not have an account?{" "}
                    <Link to="/register">Register here</Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default LoginPage;
