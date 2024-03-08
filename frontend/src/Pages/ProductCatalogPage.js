import React from 'react'
import productsWithTotalStock from '../data'
import CatalogTable from '../Components/CatalogTable'

const ProductCatalogPage = () => {
  return (
    <div>
      <h2>Product Catalog</h2>

      <CatalogTable  products={productsWithTotalStock} />
      
    </div>
  )
}

export default ProductCatalogPage
