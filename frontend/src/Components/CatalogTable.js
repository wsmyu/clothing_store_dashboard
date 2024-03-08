import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import ProductDetailCard from "./ProductDetailCard";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Dropdown } from "primereact/dropdown";

const CatalogTable = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const {token,setToken} = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [localFilters, setLocalFilters] = useState({
    global: { value: globalFilterValue, matchMode: "contains" },
    productId: { value: null, matchMode: "equals" },
    name: { value: null, matchMode: "contains" },
    description: { value: null, matchMode: "contains" },
    category: { value: null, matchMode: "startsWith" },
    color: { value: null, matchMode: "equals" },
    size: { value: null, matchMode: "equals" },
  });

  const fetchProduct = async () => {
    try {
      const response = await fetch("http://localhost:3001/products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
    setLocalFilters({
      ...localFilters,
      global: { value: e.target.value, matchMode: "contains" },
    });
  };

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

  const showToast = (severity, summary, detail) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 5000,
      closable: true,
    });
  };

  const executeDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `${token}`,
          },
        }
      );

      if (response.ok) {
        fetchProduct();
        setShowConfirmation(false);
        showToast("success", "Confirmed", "Product successfully deleted");
      }
    } catch (err) {
      showToast("error", "Error", `Error deleting product:, ${err}`);
      console.error("Error deleting product:", err);
    }
  };

  const rejectDeletion = () => {
    setShowConfirmation(false);
    showToast("info", "Canceled", "Product deletion was canceled.");
  };


  const handleEditProduct =  (productId) => {
    navigate(`/editProduct/${productId}`);
 
  };
  const actionTemplate = (rowData) => {
    return (
      <>
       <Button
          icon="pi pi-pencil"
          style={{ background: "transparent", border: "none", color: "gray", marginRight: '0.5rem' }}
          onClick={() => handleEditProduct(rowData.productId)}
        />
        <Button
          icon="pi pi-trash"
          style={{ background: "transparent", border: "none", color: "red" }}
          onClick={() => setShowConfirmation(true)}
        />
        <ConfirmationDialog
          visible={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          message="Do you want to delete this product?"
          header="Delete Confirmation"
          icon="pi pi-info-circle"
          acceptClassName="p-button-danger"
          accept={() => executeDelete(rowData.productId)}
          reject={() => rejectDeletion()}
        />
      </>
    );
  };

  const tableHeader = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </span>
    </div>
  );

  const headerStyles = {
    backgroundColor: "white",
   fontSize:"12px"
  };

  const [expandedRows, setExpandedRows] = useState(null);

  const onRowToggle = (e) => {
    setExpandedRows(e.data);
  };

  const rowExpansionTemplate = (productId) => {
    return <ProductDetailCard productId={productId} />;
  };

  const gender = ["Men","Women"];
  const genderOptions = gender.map((gender) => ({
    label: gender,
    value: gender,
  }));

  const genderFilterTemplate = (options) => {
    return (
      <div>
        <Dropdown
          value={options.value}
          options={genderOptions}
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              gender: { value: e.value, matchMode: "equals" },
            })
          }
          className="p-column-filter p-dropdown"
          showClear
          style={{ width: "6vw" }}
        />
      </div>
    );
  };
  const tableContent = (
    <DataTable
      value={products}
      filterDisplay="row"
      paginator 
      rows={5}
      filters={localFilters}
      globalFilterFields={["name", "category", "productId", "color", "description"]}
      scrollable
      scrollHeight="500px"
      expandedRows={expandedRows}
      onRowToggle={onRowToggle}
      rowExpansionTemplate={(rowData) =>
        rowExpansionTemplate(rowData.productId)
      }
    >
      <Column headerStyle={headerStyles} expander />
      <Column
        field="productId"
        filter
        filterPlaceholder="Search"
        sortable
        header="productId"
        headerStyle={headerStyles}
        style={{maxWidth:"180px", fontSize:"12px"}}
      />
      <Column
        field="name"
        filter
        filterPlaceholder="Search"
        sortable
        header="Name"
        style={{fontSize:"12px"}}
        headerStyle={headerStyles}
        body={(rowData) => {
          return rowData.name;
        }}
      />
      <Column
        field="description"
        header="Description"
        filter
        filterPlaceholder="Search"
        style={{maxWidth:"200px" , fontSize:"12px"}}
        headerStyle={headerStyles}
      />
    <Column
        field="gender"
        header="Gender"
        filter
        filterElement={genderFilterTemplate}
        style={{maxWidth:"220px" , fontSize:"12px"}}
        headerStyle={headerStyles}
      />

      <Column
        header="Image"
        headerStyle={headerStyles}
        body={imageBodyTemplate}
      ></Column>
      <Column
        field="category"
        className="table-input"
        filter
        filterPlaceholder="Search"
        header="Category"
        style={{maxWidth:"150px" , fontSize:"12px"}}
        headerStyle={headerStyles}
      />
      <Column
        header="Actions"
        headerStyle={headerStyles}
        style={{maxWidth:"200px", fontSize:"12px"}}
        body={actionTemplate}
      />
    </DataTable>
  );

  return (
    <div className="product-table">
      {tableHeader}
     
      {tableContent}
    
      <Toast ref={toast} />
    </div>
  );
};

export default CatalogTable;
