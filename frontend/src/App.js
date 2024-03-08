import "./App.css";
import React, { useState } from "react";
import SidebarMenu from "./Components/SidebarMenu";
import StockOverviewPage from "./Pages/StockOverviewPage";
import { Routes, Route } from "react-router-dom";
import VariantInventoryPage from "./Pages/VariantInventoryPage";
import ProductCatalogPage from "./Pages/ProductCatalogPage";
import ProductAttributePage from "./Pages/ProductAttributePage";
import HomePage from "./Pages/HomePage";
import AddProductPage from "./Pages/AddProductPage";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import MyProfilePage from "./Pages/MyProfilePage";
import EditProfilePage from "./Pages/EditProfilePage";
import EditProductPage from "./Pages/EditProductPage";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [staffId, setStaffId] = useState(null);
  
  return (
    <div className="App">
      {!isLoggedIn && (
        <div className="registration-container">
          <Routes>
            {/* <Route path="/" element={<WelcomePage />} /> */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<LoginPage setLoggedIn={setLoggedIn} setStaffId={setStaffId} />} />
          </Routes>
        </div>
      )}

      {isLoggedIn && (
        <div className="grid-container ">
          <div className="sidebar-menu">
            <SidebarMenu staffId={staffId} setLoggedIn={setLoggedIn} />
          </div>
          <div className="main-content">
            <Routes>
              <Route path="/home" element={<HomePage />} />

              <Route path="/stockOverview" element={<StockOverviewPage />} />
              <Route
                path="/variantInventory"
                element={<VariantInventoryPage />}
              />
              <Route path="/productCatalog" element={<ProductCatalogPage />} />
              <Route path="/addProduct" element={<AddProductPage />} />
              <Route
                path="/productAttribute/:id"
                element={<ProductAttributePage />}
              />
              <Route path="/myProfile" element={<MyProfilePage staffId={staffId} />} />
              <Route path="/editProfile" element={<EditProfilePage staffId={staffId} />} />
              <Route path="/editProduct/:productId" element={<EditProductPage  />} />
            
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
