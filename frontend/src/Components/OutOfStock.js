import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const OutofStock = ({ products }) => {
    const flattenedProducts =products.flatMap(
        (product) =>
          (product.variants &&
            product.variants.map((variant) => ({
              ...product,
              ...variant,
            }))))
  
  const outOfStockProducts = flattenedProducts.filter((product) => product.stock === 0);
  

  return (
    <div>
      <h2>Out of Stock Products</h2>
      <DataTable value={outOfStockProducts} className="p-datatable-sm">
        <Column field="name" header="Product Name" sortable></Column>
        <Column field="stock" header="Stock" sortable></Column>
      </DataTable>
    </div>
  );
};

export default OutofStock;