import React, { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import productsWithTotalStock from "../data";
import { Form, Button, Col, Row } from "react-bootstrap";

const ProductAttributePage = () => {
  const [product, setProduct] = useState("");
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const getProductById = (id) => {
    return productsWithTotalStock.find((product) => product.id === id);
  };
  useEffect(() => {
    setProduct(getProductById(id));
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };


  const handleImageUpload = (event) => {
    // Your image upload logic here
    const file = event.target.files[0];
    // Process the file, such as uploading it to a server
    console.log('Selected file:', file);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click(); 
  };

  return (
    <div>
      <h1>Product Attribute Form</h1>
      <Row>
        <Col
          md={3}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "50%", height: "auto" }}
          />
          <Button className="upload-image-button" onClick={handleUploadButtonClick}>
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Col>
        <Col md={9}>
          {/* Product Attribute Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="productName" className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                className="w-25"
                type="text"
                placeholder="Enter product name"
                value={product.name}
              />
            </Form.Group>

            <Form.Group controlId="productDescription" className="mb-3">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                className="w-50"
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={product.description}
              />
            </Form.Group>

            <Form.Group controlId="productPrice" className="mb-3">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                className="w-25"
                type="text"
                placeholder="Enter product price"
                value={product.price}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ProductAttributePage;
