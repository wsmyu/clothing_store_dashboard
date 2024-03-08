// import React from "react";

// const ProductDetailCard = () => {
//   const product = {
//     id: "001",
//     name: "T-Shirt",
//     category: "Top",
//     description: "Comfortable cotton t-shirt",
//     price: 19.99,
//     image:
//       "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/232359F110010_1/the-row-white-wesler-t-shirt.jpg",
//     variants: [
//       {
//         color: "Black",
//         size: "M",
//         stock: 0,
//       },
//       {
//         color: "White",
//         size: "M",
//         stock: 120,
//       },
//     ],
//   };

//   return (
//     <div className="product-detail-card">
//       <div className="product-detail-grid">
//         <div className="product-detail-img">
//           <img
//             src={product.image}
//             alt="product-img"
//             style={{ width: "40px", height: "auto" }}
//           />
//         </div>
//         <div className="product-detail-content">
//           <div className="row">
//             {/* <div className="col-md-3">
//             <img
//               src={product.image}
//               alt="product-img"
//               style={{ width: "40px", height: "auto" }}
//             />
//           </div> */}
//             <div className="col-md-3">
//               <p>Name</p>
//               <p>{product.name}</p>
//             </div>
//             <div className="col-md-3">
//               <p>Description</p>
//               <p>{product.description}</p>
//             </div>
//             <div className="col-md-3">
//               <p>Price</p>
//               <p>{product.price}</p>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-md-3"></div>
//             <div className="col-md-3">
//               <p>Category</p>
//               <p>{product.category}</p>
//             </div>
//             <div className="col-md-3">
//               <p>Color</p>
//               <p>Black, White, Grey</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailCard;
import React, { useState, useEffect } from "react";

const ProductDetailCard = ({ productId }) => {
  const [product, setProduct] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/products/${productId}`
        );
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Failed to fetch product data");
        }
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  const imageBodyTemplate = (product) => {
    const baseUrl = "http://localhost:3001/";
    return (
      <img
        src={`${baseUrl}${product.variants[0].image.replace(/\\/g, "/")}`}
        alt={product.variants[0].image.replace(/\\/g, "/")}
        width="50"
        height="auto"
        onError={(e) => console.error("Image failed to load", e)}
      />
    );
  };

  return (
    <div className="product-detail-content">
      <div className="flex-container">
        <div className="image-column">
          {product.variants &&
            product.variants.length > 0 &&
            imageBodyTemplate(product)}
        </div>
        <div className="details-column">
          <div className="details-left-column">
            <p className="details-title">Product Id</p>
            <p className="details-data">{product.productId}</p>
            <p className="details-title">Name</p>
            <p className="details-data">{product.name}</p>
            <p className="details-title">Description </p>
            <p className="details-data">{product.description}</p>
          </div>
          <div className="details-middle-column">
            <p className="details-title">Price</p>
            <p className="details-data">${product.price}</p>
            <p className="details-title">Category</p>
            <p className="details-data">{product.category}</p>
            <p className="details-title">Made in </p>
            <p className="details-data">{product.madeIn}</p>
          </div>
          <div className="details-right-column">
            <p className="details-title">Available Size</p>
            {product.variants && (
              <p className="details-data">
                {product.variants.map((variant) => variant.size).join(", ")}
              </p>
            )}

            <p className="details-title">Available Color</p>
            {product.variants && (
              <p className="details-data">
                {product.variants.map((variant) => variant.color).join(", ")}
              </p>
            )}
          </div>
          <div className="details-last-column">
            <p className="details-title">Gender </p>
            <p className="details-data">{product.gender}</p>
            <p className="details-title">Material</p>
            <p className="details-data">{product.material}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCard;
