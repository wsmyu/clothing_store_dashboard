import React from "react";
import productsWithTotalStock from "../data";
import ProductTable from "../Components/ProductTable";

const VariantInventoryPage = () => {
  return (
    <div className="variant-inventory ">
      <h2>Variant Inventory</h2>
      <div className="variant-table">
        <ProductTable products={productsWithTotalStock} type="variant" />
      </div>
    </div>
  );
};

export default VariantInventoryPage;
