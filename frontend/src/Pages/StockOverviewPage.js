import React, { useState } from 'react'
import ProductTable from '../Components/ProductTable';

const StockOverviewPage = () => {
  
      return (
        <div className="stock-overview">
          <h2>Inventory Overview</h2>
          <ProductTable  type='overview'/>
        </div>
      );
    };
    
    export default StockOverviewPage;
    
    
    




