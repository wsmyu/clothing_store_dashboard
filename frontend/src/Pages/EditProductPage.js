import React, { useState, useRef, useEffect } from "react";
import { Form, ProgressBar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Toast } from "primereact/toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ConfirmationDialog from "../Components/ConfirmationDialog";

const EditProductPage = () => {
  const toast = useRef(null);
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const { token, setToken } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [product, setProduct] = useState({
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

  const fetchProductDataById = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/products/${productId}`
      );
      if (response.ok) {
        const productData = await response.json();
        console.log(productData);
        return productData;
      } else {
        console.error("Error fetching product data:", response.status);
        return null; // Handle error appropriately
      }
    } catch (error) {
      console.error("Error fetching product data:", error.message);
      return null; // Handle error appropriately
    }
  };

  useEffect(() => {
    fetchProductDataById(productId)
      .then((response) => {
        setProduct(response);
        setLoading(false);
      })
      .catch((error) => {
        // Handle error appropriately
        setLoading(false);
        console.error("Error in useEffect:", error.message);
      });
  }, [productId]);

  const showSuccessToast = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      // Handle the form submission logic here
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
      console.log(product);
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

  const updateProductInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/products/updateProduct/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            productId: product.productId,
            name: product.name,
            description: product.description,
            category: product.category,
            madeIn: product.madeIn,
            gender: product.gender,
            material: product.material,
            price: product.price,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setCurrentStep(2);
        showSuccessToast("Product updated successfully");
        return responseData;
      } else {
        throw new Error("Failed to update product info");
      }
    } catch (error) {
      throw new Error(`Error updating product info: ${error.message}`);
    }
  };

  const removeVariant = async (variantId) => {
    try {
      const updatedVariants = product.variants.filter(
        (variant) => variant.variantId !== variantId
      );

      // Perform the removal for the specific variant
      const response = await fetch(
        `http://localhost:3001/products/removeVariant/${product.productId}/${variantId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        setProduct({ ...product, variants: updatedVariants });
        setShowConfirmation(false);
        showSuccessToast("Variant removed successfully");
  
      } else {
        // If the server operation fails, rollback the local state
        // updatedVariants.splice(variantIndex, 0, removedVariant);
        // setProduct({ ...product, variants: updatedVariants });

        showErrorToast(`Failed to remove Variant ${variantId}`);
      }
    } catch (error) {
      console.error(`Error removing Variant ${variantId}:`, error.message);
      showErrorToast(`Failed to remove Variant ${variantId}`);
    }
  };

  const rejectDeletion = () => {
    setShowConfirmation(false);
    showErrorToast( "Product deletion was canceled.");
  };

  const updateVariant = async (variantIndex) => {
    try {
      const updatedVariant = {
        variantId: product.variants[variantIndex].variantId,
        color: product.variants[variantIndex].color,
        size: product.variants[variantIndex].size,
        stock: product.variants[variantIndex].stock,
        image: product.variants[variantIndex].image,
      };

      const formData = new FormData();
      formData.append("variantId", updatedVariant.variantId);
      formData.append("color", updatedVariant.color);
      formData.append("size", updatedVariant.size);
      formData.append("stock", updatedVariant.stock);
      formData.append("variantImage", updatedVariant.image);

      // if (product.variants[variantIndex].image) {
      //   formData.append("variantImage", product.variants[variantIndex].image);
      // }

      // Add logic to append the image to formData if it has changed
      // if (product.variants[variantIndex].image instanceof File) {
      //   formData.append("variantImage", product.variants[variantIndex].image);
      // }

      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      // Perform the update for the specific variant
      const response = await fetch(
        `http://localhost:3001/products/updateVariant/${product.productId}/${variantIndex}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        showSuccessToast("Variant updated successfully");
        console.log(
          `Variant ${variantIndex} updated successfully:`,
          responseData
        );
      } else {
        showErrorToast(`Failed to update Variant ${variantIndex}`);
      }
    } catch (error) {
      console.error(`Error updating Variant ${variantIndex}:`, error.message);
      showErrorToast(`Failed to update Variant ${variantIndex}`);
    }
  };

  // const updateProduct = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("productId", product.productId);
  //     formData.append("name", product.name);
  //     formData.append("description", product.description);
  //     formData.append("category", product.category);
  //     formData.append("madeIn", product.madeIn);
  //     formData.append("gender", product.gender);
  //     formData.append("material", product.material);
  //     formData.append("price", product.price);

  //     product.variants.forEach((variant, index) => {
  //       formData.append(`variants[${index}][variantId]`, variant.variantId);
  //       formData.append(`variantImages`, variant.image);
  //       formData.append(`variants[${index}][color]`, variant.color);
  //       formData.append(`variants[${index}][size]`, variant.size);
  //       formData.append(`variants[${index}][stock]`, variant.stock);
  //     });
  //     console.log(`formData variant image: ${formData.get('variantImages')}`);

  //     const response = await fetch(
  //       `http://localhost:3001/products/updateProduct/${product.productId}`,
  //       {
  //         method: "PUT",
  //         body: formData,
  //       }
  //     );
  //     if (response.ok) {
  //       const responseData = await response.json();
  //       showSuccessToast();
  //       console.log("Product Updated successfully:", responseData);
  //       setCurrentStep(1);
  //       setProduct({});
  //     }
  //   } catch (error) {
  //     showErrorToast("Failed to update product");
  //     console.error("Error updating product:", error.message);
  //   }
  // };
  //   try {
  //     const requestBody = {
  //       productId: product.productId,
  //       name: product.name,
  //       description: product.description,
  //       category: product.category,
  //       madeIn: product.madeIn,
  //       gender: product.gender,
  //       material: product.material,
  //       price: product.price,
  //       variants: product.variants.map((variant) => ({
  //         variantId: variant.variantId,
  //         color: variant.color,
  //         size: variant.size,
  //         stock: variant.stock,
  //         image:variant.image
  //       })),
  //     };

  //     const response = await fetch(
  //       `http://localhost:3001/products/updateProduct/${product.productId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(requestBody),
  //       }
  //     );

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       showSuccessToast();
  //       console.log("Product Updated successfully:", responseData);
  //       setCurrentStep(1);
  //       setProduct({});
  //     }
  //   } catch (error) {
  //     showErrorToast("Failed to update product");
  //     console.error("Error updating product:", error.message);
  //   }
  // };

  return (
    <div>
      <h1>Edit Product</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProgressBar
            now={progressBarPercentage}
            className="custom-progress-bar mt-3"
          />

          <Form onSubmit={handleSubmit}>
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

                    <Form.Group
                      controlId="productCategory"
                      className="w-50 mb-3"
                    >
                      <Form.Label>Product Category</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        placeholder="Product Category"
                        value={product.category}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="productMaterial"
                      className="w-50 mb-3"
                    >
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
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
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

                  <Form.Group
                    controlId="productDescription"
                    className="w-100 mb-3"
                  >
                    <Form.Label>Product Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      placeholder="Product Description"
                      value={product.description}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-center mt-3 gap-3">
                    <Button
                      className="btn-dark"
                      onClick={() => updateProductInfo(productId)}
                    >
                      Update
                    </Button>
                    <Button className="btn-secondary " onClick={handleSubmit}>
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
                      {variant.imagePreview ? (
                        <img
                          src={variant.imagePreview}
                          alt="variant img"
                          style={{ maxWidth: "150px", height: "auto" }}
                        />
                      ) : variant.image ? (
                        <img
                          src={`http://localhost:3001/${variant.image}`}
                          alt="variant img"
                          style={{ width: "200px" }}
                        />
                      ) : null}
                    </div>
                    <div className="row">
                      <div className="col">
                        <Form.Group controlId={`variantColor_${index}`}>
                          <Form.Label>Variant ID</Form.Label>
                          <Form.Control
                            className="w-50"
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
                            className="w-50"
                            value={variant.size}
                            onChange={(e) =>
                              handleVariantChange(e, "size", index)
                            }
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
                            className="w-50"
                            type="text"
                            value={variant.color}
                            onChange={(e) =>
                              handleVariantChange(e, "color", index)
                            }
                          />
                        </Form.Group>
                      </div>
                      <Form.Group controlId="productImage">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control
                          type="file"
                          name="variantImage"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, index)}
                          className="mb-3 w-25"
                        />
                      </Form.Group>
                    </div>
                    <div className="edit-variant-buttons">
                      <Button
                        variant="secondary"
                        style={{ width: "200px", marginBottom: "10px" }}
                        onClick={() => updateVariant(index)}
                      >
                        Update Variant Info
                      </Button>
                      <Button
                        variant="danger"
                        style={{ width: "200px" }}
                        onClick={() => setShowConfirmation(true)}
                      >
                        Remove Variant
                      </Button>
                    </div>
                    <ConfirmationDialog
                      visible={showConfirmation}
                      onHide={() => setShowConfirmation(false)}
                      message="Do you want to delete this variant?"
                      header="Delete Confirmation"
                      icon="pi pi-info-circle"
                      acceptClassName="p-button-danger"
                      accept={() => {
                        removeVariant(variant.variantId);
                      }}
                      reject={() => rejectDeletion()}
                    />
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
                </div>
              </div>
            )}
          </Form>

          <Toast ref={toast} />
        </>
      )}
    </div>
  );
};

export default EditProductPage;
