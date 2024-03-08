import React, { useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineInventory2 } from "react-icons/md";
import { GrCatalog } from "react-icons/gr";
import { BsClipboardData } from "react-icons/bs";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "../AuthContext";

const SidebarMenu = ({ staffId, setLoggedIn }) => {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();
  const handleLogout = () => {
    // Clear user information from localStorage
    localStorage.removeItem("userInfo");

    // Clear user information from state
    setLoggedIn(false);
    setToken(null);

    // Redirect to the login page or any other desired page
    navigate("/");
  };

  return (
    <>
      <Sidebar
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "white",
            width: "15rem",
            height: "100vh",
            color: "black",
          },
          [`.${sidebarClasses.container} a`]: {
            fontSize: "13px", 
          },
        }}
      >
   

        <Menu
          menuItemStyles={{
            button: ({ level }) => ({
              "&:hover": {
                backgroundColor: level === 0 ? "white" : "#ebeced",
                transition: "margin-left 0.5s",
                borderRadius: "10px",
                marginLeft: "0.5rem",
              },
            }),

            subMenuContent: {
              backgroundColor: "#ebeced",
            },
          }}
        >
          <MenuItem component={<Link to="/home" />} icon={<BiHomeAlt />}>
            DashBoard
          </MenuItem>
          <SubMenu label="Product Management" icon={<MdEdit />}>
            <MenuItem
              component={<Link to="/productCatalog" />}
              icon={<GrCatalog />}
            >
              Products Catalog
            </MenuItem>

            <MenuItem
              component={<Link to="/addProduct" />}
              icon={<AiOutlineAppstoreAdd />}
            >
              Add Product
            </MenuItem>
          </SubMenu>
          <SubMenu label="Inventory Management" icon={<MdOutlineInventory2 />}>
            <MenuItem
              component={<Link to="/stockOverview" />}
              icon={<BsClipboardData />}
            >
              Inventory Overview
            </MenuItem>
            <MenuItem
              component={<Link to="/variantInventory" />}
              icon={<BiCube />}
            >
              Variant Inventory
            </MenuItem>
          </SubMenu>

          <MenuItem component={<Link to="/myProfile" />} icon={<FaRegUser />}>
            My Profile
          </MenuItem>

          <MenuItem onClick={handleLogout} icon={<RiLogoutBoxRLine />}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
};

export default SidebarMenu;
