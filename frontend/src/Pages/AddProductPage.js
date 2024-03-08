import React, { useState, useRef } from "react";
import { Form, ProgressBar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Toast } from "primereact/toast";
import { useAuth } from '../AuthContext';

const AddProductPage = () => {
  const toast = useRef(null);
  const {token,setToken} = useAuth();

  const [product, setProduct] =useState( {
    productId: "",
    name: "",
    description: "",
    category: "",
    madeIn: "",
    gender: "",
    material: "",
    price: 0,
    variants: [{ variantId: "", image: null, color: "", size: "", stock: 0 }],
  });

  const [currentStep, setCurrentStep] = useState(1);


  const showSuccessToast = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Product added successfully",
      life: 5000,
    });
  };

  const showErrorToast = (errorMessage) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage || "Failed to add product",
      life: 5000,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
  
    if (currentStep === 1) {
      // Validate fields for Step 1
      if (
        !product.productId ||
        !product.name ||
        !product.category ||
        !product.gender ||
        !product.description ||
        !product.madeIn ||
        !product.material ||
        !product.price
      ) {
        showErrorToast("Please fill in all fields");
        console.error("Validation Error: Please fill in all required fields");
      } else {
        setCurrentStep(2);
      }
    } else {
      // Additional logic for other steps
      console.log("Product Details:", product);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleVariantChange = (e, field, index) => {
    const { value } = e.target;
    setProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };
      return { ...prevProduct, variants: updatedVariants };
    });
  };

  const handleImageChange = (e, variantIndex) => {
    const imageFile = e.target.files[0];
    setProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        image: imageFile,
        imagePreview: URL.createObjectURL(imageFile),
      };
      console.log(imageFile);
      return { ...prevProduct, variants: updatedVariants };
    });
  };

  const progressBarPercentage = (currentStep - 1) * 50;

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { color: "", size: "", stock: 0 }],
    });
  };

  const addProduct = async () => {
    try {
      const formData = new FormData();

      // Append product data to FormData
      formData.append("productId", product.productId);
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("madeIn", product.madeIn);
      formData.append("gender", product.gender);
      formData.append("material", product.material);
      formData.append("price", product.price);

      // Append variant data to FormData
      product.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][variantId]`, variant.variantId);
        formData.append("variantImages", variant.image);
        formData.append(`variants[${index}][color]`, variant.color);
        formData.append(`variants[${index}][size]`, variant.size);
        formData.append(`variants[${index}][stock]`, variant.stock);
      });

      // Make the fetch request
      const response = await fetch(
        "http://localhost:3001/products/addProduct",
        {
          method: "POST",
          body: formData,
          headers: {
            'Authorization': `${token}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        showSuccessToast();
        console.log("Product added successfully:", responseData);
        setCurrentStep(1);
        setProduct({});
      }
    } catch (error) {
      showErrorToast("Failed to add product");
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <ProgressBar
        now={progressBarPercentage}
        className="custom-progress-bar mt-3"
      />

      <Form onSubmit={handleNext}>
        {currentStep === 1 && (
          <div className="add-product-form">
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="productId">
                  <Form.Label>Product Id</Form.Label>
                  <Form.Control
                    className="w-50 mb-3"
                    type="text"
                    name="productId"
                    placeholder="Product Id"
                    value={product.productId}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="productName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    className="w-50 mb-3"
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="productCategory" className="w-50 mb-3">
                  <Form.Label>Product Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    placeholder="Product Category"
                    value={product.category}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="productMaterial" className="w-50 mb-3">
                  <Form.Label>Product Material</Form.Label>
                  <Form.Control
                    type="text"
                    name="material"
                    placeholder="Product Material"
                    value={product.material}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="gender" className="w-50 mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={product.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Men</option>
                    <option value="Female">Women</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="productPrice" className="w-50 mb-3">
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    placeholder="$"
                    min={0}
                    value={product.price}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="madeIn" className="w-50 mb-3">
                  <Form.Label>Made In</Form.Label>
                  <Form.Control
                    type="text"
                    name="madeIn"
                    placeholder="Made In"
                    value={product.madeIn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>

              <Form.Group controlId="productDescription" className="w-100 mb-3">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  placeholder="Product Description"
                  value={product.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <div className="d-flex justify-content-center mt-3">
                <Button className="form-button btn-secondary" type="submit">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={addVariant}>
                + Add Variant
              </Button>
            </div>

            {product.variants.map((variant, index) => (
              <div key={index} className="variant-container d-flex">
                <div className="image-preview-container">
                  {variant.imagePreview && (
                    <img src={variant.imagePreview} alt="variant img" style={{maxWidth:"150px",height:"auto"}}/>
                  )}
                </div>
                <div className="row">
                  <div className="col">
                    <Form.Group controlId={`variantColor_${index}`}>
                      <Form.Label>Variant ID</Form.Label>
                      <Form.Control
                        className="w-50 mb-3"
                        type="text"
                        value={variant.variantId}
                        onChange={(e) =>
                          handleVariantChange(e, "variantId", index)
                        }
                      />
                    </Form.Group>
                   
                  </div>
                  <div className="col">
                    <Form.Group controlId={`variantSize_${index}`}>
                      <Form.Label>Size</Form.Label>
                      <Form.Select
                        className="w-75"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(e, "size", index)}
                      >
                        <option value="">Select Size</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="col">
                  <Form.Group controlId={`variantColor_${index}`}>
                      <Form.Label>Color</Form.Label>
                      <Form.Control
                        className="w-50 mb-3"
                        type="text"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(e, "color", index)}
                      />
                    </Form.Group>
                    </div>
                  <div className="col">
                    <Form.Group controlId={`variantStock_${index}`}>
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        className="w-50 mb-3"
                        type="number"
                        value={variant.stock}
                        min={0}
                        onChange={(e) => handleVariantChange(e, "stock", index)}
                      />
                    </Form.Group>
                  </div>
                  <Form.Group controlId="productImage">
                    <Form.Label>Product Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="mb-3 w-50"
                    />
               
                  </Form.Group>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="secondary"
                type="submit"
                onClick={handlePreviousStep}
              >
                Previous
              </Button>
              <Button variant="dark" type="submit" onClick={addProduct}>
                Add Product
              </Button>
            </div>
          </div>
        )}
      </Form>
      <Toast ref={toast} />
    </div>
  );
};
export default AddProductPage;
