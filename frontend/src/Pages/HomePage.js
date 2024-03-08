import React, { useState, useEffect } from "react";
import productsWithTotalStock from "../data";
import CardTemplate from "../Components/CardTemplate";
import { BiCategoryAlt } from "react-icons/bi";
import { BsCartX } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";

import ProductQuantityBarChart from "../Components/ProductQuantityBarChart";
import UpdateSession from "../Components/UpdatesSession";
import ProductTable from "../Components/ProductTable";
import GroupedOutOfStockChart from "../Components/GroupedOutOfStockChart";

import ReusablePieChart from "../Components/ReusablePieChart";

const HomePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(null);
  const [outOfStockProducts, setOutOfStockProducts] = useState(null);
  const [totalCategories, setTotalCategories] = useState(null);
  const backgroundColor = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 205, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(201, 203, 207, 0.2)",
  ];
  const borderColor = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(201, 203, 207)",
  ];
  const fetchTotalProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/products/totalProducts"
      );
      const data = await response.json();
      setTotalProducts(data);
    } catch (error) {
      console.error("Error fetching total number of products:", error);
    }
  };

  const fetchOutOfStockProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/products/outOfStockProducts"
      );
      const data = await response.json();
      setOutOfStockProducts(data);
    } catch (error) {
      console.error("Error fetching out-of-stock products:", error);
    }
  };
  const fetchCategoriesNumber = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/products/totalCategories"
      );
      const data = await response.json();
      setTotalCategories(data);
    } catch (error) {
      console.error("Error fetching categories number:", error);
    }
  };
  useEffect(() => {
    fetchOutOfStockProducts();
    fetchTotalProducts();
    fetchCategoriesNumber();
  }, []);

  return (
    <div className="home-page">
      <h2>Overview</h2>

      <div className="row">
        <div className="col-md-4">
          <CardTemplate
            title="Total Products"
            text1={totalProducts}
            icon={<AiOutlineShoppingCart />}
          />
        </div>
        <div className="col-md-4">
          <CardTemplate
            title="Out of Stock Items"
            text1={outOfStockProducts}
            icon={<BsCartX />}
          />
        </div>
        <div className="col-md-4">
          <CardTemplate
            title="All Categories"
            text1={totalCategories}
            icon={<BiCategoryAlt />}
          />
        </div>
      </div>

      <div className="row">
        <div className="charts">
          <div className="col-md-4 chart-container">
            <ReusablePieChart
              endpoint=""
              title="Product Category Proportion"
              dataKey="category"
              backgroundColor={backgroundColor}
              borderColor={borderColor}
            />
          </div>
          <div className="col-md-4 chart-container">
            <ReusablePieChart
              endpoint=""
              title="Product Gender Proportion"
              dataKey="gender"
              backgroundColor={backgroundColor}
              borderColor={borderColor}
            />
          </div>
          <div className="col-md-4 chart-container">
            <ProductQuantityBarChart
              products={allProducts}
              backgroundColor={backgroundColor}
              borderColor={borderColor}
            />
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-3 chart-container">
          <GroupedOutOfStockChart
            endpoint="outOfStockBySize"
            chartTitle="Out of Stock by Size"
            backgroundColor={backgroundColor}
            borderColor={borderColor}
          />
        </div>

        <div className="col-md-3 chart-container">
          <GroupedOutOfStockChart
            endpoint="outOfStockByCategory"
            chartTitle="Out of Stock by Category"
            backgroundColor={backgroundColor}
            borderColor={borderColor}
          />
        </div>

        <div className="col-md-4 update-sesion">
          <UpdateSession />
        </div>
      </div>

      <div className="out-of-stock-table row">
        <h3>Out of Stock Items</h3>
        <ProductTable products={productsWithTotalStock} type={"outOfStock"} />
      </div>
    </div>
  );
};

export default HomePage;
