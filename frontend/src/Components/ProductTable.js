import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import StockCounter from "./StockCounter";

const ProductTable = ({ type }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [localFilters, setLocalFilters] = useState({
    global: { value: globalFilterValue, matchMode: "contains" },
    productId: { value: null, matchMode: "contains" },
    variantId: { value: null, matchMode: "contains" },
    name: { value: null, matchMode: "contains" },
    category: { value: null, matchMode: "startsWith" },
    color: { value: null, matchMode: "equals" },
    size: { value: null, matchMode: "equals" },
    description:{value: null, matchMode: "contains" }
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
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
  const statusBodyTemplate = (product) => {
    if (type === "overview") {
      if (product.totalStock === 0) {
        return <Tag value="Out of Stock" severity="danger"></Tag>;
      } else if (product.totalStock < 50) {
        return <Tag value="Low Stock" severity="warning"></Tag>;
      } else {
        return (
          <Tag value="In Stock" style={{ backgroundColor: "#71d1a1" }}></Tag>
        );
      }
    } else {
      if (product.stock === 0) {
        return <Tag value="Out of Stock" severity="danger"></Tag>;
      } else if (product.stock < 50) {
        return <Tag value="Low Stock" severity="warning"></Tag>;
      } else {
        return (
          <Tag value="In Stock" style={{ backgroundColor: "#71d1a1" }}></Tag>
        );
      }
    }
  };


  const sizes = ["XS", "S", "M", "L", "XL"];
  const sizeOptions = sizes.map((size) => ({
    label: size,
    value: size,
  }));

  const sizeFilterTemplate = (options) => {
    return (
      <div>
        <Dropdown
          value={options.value}
          options={sizeOptions}
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              size: { value: e.value, matchMode: "equals" },
            })
          }
          className="p-column-filter p-dropdown"
          showClear
          style={{ width: "6vw" }}
        />
      </div>
    );
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
  const stockField =
    type === "variant" || type === "outOfStock" ? "stock" : "totalStock";

  const flattenedProducts = products.flatMap(
    (product) =>
      product.variants &&
      product.variants.map((variant) => ({
        ...product,
        ...variant,
      }))
  );
  const outOfStockProducts = flattenedProducts.filter(
    (product) => product.stock === 0
  );

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
  const commonColumnStyle = {
    fontSize: "13px",
  };

  let tableValue;

  if (type === "variant" || type === "expand") {
    tableValue = flattenedProducts;
  } else if (type === "outOfStock") {
    tableValue = outOfStockProducts;
  } else {
    tableValue = products;
  }

  const handleTableRefresh = async () => {
    // Fetch the updated data from the server
    const response = await fetch("http://localhost:3001/products");
    const data = await response.json();
    setProducts(data);
  };

  const tableContent = (
    <DataTable
      paginator rows={5}
      value={tableValue}
      filterDisplay={type === "outOfStock" ? "none" : "row"}
      filters={localFilters}
      globalFilterFields={[
        "name",
        "category",
        "productId",
        "color",
        "variantId",
        "description"
      ]}
      globalFilter={globalFilterValue}
      scrollable
      scrollHeight={type === "outOfStock" ? "300px" : "500px"}
      
    >
      <Column
        field="productId"
        filter={type !== "expand" && type !== "outOfStock"}
        filterPlaceholder="Search"
        sortable
        header="Product Id"
        style={{ fontSize:"12px"}}
        headerStyle={headerStyles}
      />
      {type === "variant" || type==="outOfStock" ? (
        <Column
          field="variantId"
          filter={type !== "expand" }
          filterPlaceholder="Search"
          sortable
          header="Variant Id"
          style={commonColumnStyle}
          headerStyle={headerStyles}
        />
      ) : null}
      <Column
        field="name"
        filter={type !== "expand" && type !== "outOfStock"}
        filterPlaceholder="Search"
        sortable
        header="Name"
        style={commonColumnStyle}
        headerStyle={headerStyles}
        body={(rowData) => {
          if (type === "catalog") {
            return (
              <a
                href={`productAttribute/${rowData.id}`}
                className="link-attribute-page"
              >
                {rowData.name}
              </a>
            );
          } else {
            return rowData.name;
          }
        }}
      />
      {type === "variant" || type === "expand"  || type === "outOfStock" ? null : (
        <Column
          field="description"
          header="Description"
          filter
          filterPlaceholder="Search"
          style= {commonColumnStyle}
          headerStyle={headerStyles}
        />
      )}
         <Column
        field="gender"
        header="Gender"
        filter
        filterElement={genderFilterTemplate}
        style={commonColumnStyle}
        headerStyle={headerStyles}
      />

      <Column
        header="Image"
        headerStyle={headerStyles}
        body={imageBodyTemplate}
      />
      <Column
        field="category"
        className="table-input"
        filter={type !== "expand" && type !== "outOfStock"}
        filterPlaceholder="Search"
        header="Category"
        style={commonColumnStyle}
        headerStyle={headerStyles}
      />
      {type === "variant" || type === "expand" || type === "outOfStock" ? (
        <Column
          field="color"
          body={(rowData) => rowData.color}
          header="Color"
          filter={type !== "expand" && type !== "outOfStock"}
          filterPlaceholder="Search"
          style={commonColumnStyle}
          headerStyle={headerStyles}
        />
      ) : null}
      {type === "variant" || type === "expand" || type === "outOfStock" ? (
        <Column
          field="size"
          header="Size"
          body={(rowData) => rowData.size}
          showFilterMenu={false}
          filter={type !== "expand" && type !== "outOfStock"}
          filterElement={sizeFilterTemplate}
          style={commonColumnStyle}
          headerStyle={headerStyles}
        />
      ) : null}
      {type === "variant" ||
      type === "expand" ||
      type === "outOfStock" ||
      type === "overview" ? null : (
        <Column
          field="price"
          sortable
          header="Price"
          headerStyle={headerStyles}
        />
      )}
      <Column
        header="Stock Status"
        headerStyle={headerStyles}
        style={commonColumnStyle}
        body={(rowData) => {
          return (
            <div>
              <div>{rowData[stockField]}</div>
              <div>{statusBodyTemplate(rowData)}</div>
            </div>
          );
        }}
      />

      {type === "variant" || type === "expand" ? (
        <Column
          header="Update Stock"
          headerStyle={headerStyles}
          style={commonColumnStyle}
          body={(rowData) => (
            <StockCounter
              product={rowData}
              handleTableRefresh={handleTableRefresh}
            />
          )}
        />
      ) : null}
    </DataTable>
  );

  return (
    <div className="product-table">
      {type === "expand" || type === "outOfStock" ? null : tableHeader}
      {tableContent}
    </div>
  );
};

export default ProductTable;
