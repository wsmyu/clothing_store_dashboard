import React, { useState,useRef } from "react";
import Button from "react-bootstrap/Button";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Toast } from "primereact/toast";
import { InputGroup, FormControl } from "react-bootstrap";
import { useAuth } from '../AuthContext';

const StockCounter = ({ product,handleTableRefresh }) => {
  const toast = useRef(null);
  const [stock, setStock] = useState(product.stock);
  const {token,setToken} = useAuth();

  const incrementStock = () => {
    setStock(stock+1);
  };

  const decrementStock = (e) => {
    if (stock >0) {
      setStock(stock - 1);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
    
      setStock(parseInt(newValue, 10));
    }
  };

  const showSuccessToast = (product) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: `Stock has been successfully updated for Product ID ${product.productId}`,
      life: 5000,
    });
  };

  const showErrorToast = (product) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail:  `Failed to update stock for product ID ${product.productId}`,
      life: 5000,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/products/updateStock/${product.productId}/${product.variantId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" ,  'Authorization': `${token}`,},
          body: JSON.stringify({ newStock: stock }),
        }
      );
      if (response.ok) {
        showSuccessToast(product)
        handleTableRefresh();
      } else {
        showErrorToast(product);
      }
    } catch (err) {
      console.error("Error updating stock:", err);
      showErrorToast();
    }
  };

  return (
    <div className="stock-counter">
      <div className="counter">
        <Button className="custom-counter-button" onClick={decrementStock}>
          <AiOutlineMinus />
        </Button>

        <InputGroup>
          <FormControl
            className="custom-counter-input"
            type="number"
            value={stock}
            onChange={handleInputChange}
            style={{ width: '60px' }}
          />
        </InputGroup>

        {/* <span>{stock}</span> */}

        <Button className="custom-counter-button" onClick={incrementStock}>
          <AiOutlinePlus />
        </Button>
      </div>

      <Button className="update-button" onClick={handleUpdate}>
        Update
      </Button>
      <Toast ref={toast} />

 


    </div>
  );
};

export default StockCounter;
