const express = require("express");
const Product = require("../models/productSchema");
const AuditLog = require("../models/auditLogSchema");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const isAuth = require("../utils");

const productRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });



//Get out of stock by category 
productRouter.get('/outOfStockByCategory', async (req, res) => {
  try {
    // Aggregate data to count out-of-stock products by category
    const result = await Product.aggregate([
      { $unwind: "$variants" }, // Separate variants into individual documents
      { $match: { "variants.stock": 0 } }, // Match products with at least one variant having zero stock
      {  $group: {
        _id: '$category', // Group by category
        count: { $sum: 1 }, // Count occurrences of each category
      },}, 
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching out-of-stock products by category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Get out of stock by size
productRouter.get('/outOfStockBySize', async (req, res) => {
  try {
    // Aggregate data to count out-of-stock products by size
    const result = await Product.aggregate([
      { $unwind: "$variants" }, // Separate variants into individual documents
      { $match: { "variants.stock": 0 } }, // Match products with at least one variant having zero stock
      { $group: {
        _id: '$variants.size', // Group by size
        count: { $sum: 1 }, // Count occurrences of each size
      }},
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching out-of-stock products by size:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Find the number of total product
productRouter.get("/totalProducts", async (req, res) => {
  try {
    const response = await Product.countDocuments();
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching total products:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: error.stack,
    });
  }
});

//Get number of out of stock products
productRouter.get("/outOfStockProducts", async (req, res) => {
  try {
    const outOfStockVariantsCount = await Product.aggregate([
      { $unwind: "$variants" }, // Separate variants into individual documents
      { $match: { "variants.stock": 0 } }, // Match variants with stock 0
      { $count: "outOfStockVariantsCount" }, // Count the matched variants
    ]);

    // If there are no out-of-stock variants, the result may be an empty array, so handle it accordingly
    const count = outOfStockVariantsCount[0]
      ? outOfStockVariantsCount[0].outOfStockVariantsCount
      : 0;

    res.json(count);
  } catch (error) {
    console.error("Error fetching out-of-stock variants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//get total number of categories
productRouter.get("/totalCategories", async (req, res) => {
  try {
    const totalCategories = await Product.distinct("category").countDocuments();
    res.json(totalCategories);
  } catch (error) {
    console.error("Error fetching total categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Find specific product using product id
productRouter.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });

    if (product) {
      res.send(product);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//Find all products
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});


//Add new product
productRouter.post(
  "/addProduct",
  isAuth,
  upload.array("variantImages", 5),
  async (req, res) => {
    try {
      // Extract data from the request body
      const {
        productId,
        name,
        category,
        gender,
        description,
        madeIn,
        material,
        price,
        variants,
      } = req.body;

      // Validate the required fields
      if (
        !productId ||
        !name ||
        !category ||
        !gender ||
        !description ||
        !madeIn ||
        !material ||
        !price ||
        !variants
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
      }

      // Create a new product instance
      const newProduct = new Product({
        productId,
        name,
        category,
        gender,
        description,
        madeIn,
        material,
        price,
        variants: req.body.variants.map((variant, index) => ({
          variantId: req.body.variants[index].variantId,
          color: req.body.variants[index].color,
          size: req.body.variants[index].size,
          stock: req.body.variants[index].stock,
          image: req.files[index].path,
        })),
      });

      // Save the product to the database
      await newProduct.save();

      // Create an audit log entry for adding a new product
      const userId = req.user.userId;
      const auditLog = new AuditLog({
        admin: userId,
        action: "Add Product",
        details: `added a new product ${newProduct.productId}`,
      });

      // Save the audit log entry
      await auditLog.save();

      // Respond with the newly created product
      res.status(201).json(newProduct);
    } catch (err) {
      console.error("Error adding product:", err);
      res.status(500).json({ message: err.message });
    }
  }
);



//Update general product info
productRouter.put("/updateProduct/:productId", isAuth, async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProductData = req.body;

    // Update the product in the database
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      { $set: updatedProductData },
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).json(updatedProduct);
      console.log("Product updated successfully:", updatedProduct);

      const userId = req.user.userId;
      const auditLog = new AuditLog({
        admin: userId,
        action: "Update Product",
        details: `updated the product ${updatedProduct.productId}`,
      });

      // Save the audit log entry
      await auditLog.save();
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Update specific variant
productRouter.put(
  "/updateVariant/:productId/:variantIndex",
  isAuth,
  upload.single("variantImage"),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const variantIndex = req.params.variantIndex;
      const { variantId, color, size, stock, variantImage } = req.body;
      console.log(req);
      let updatedVariantData = {
        variantId,
        color,
        size,
        stock,
      };

      if (req.file) {
        updatedVariantData.image = req.file.path;
      } else {
        updatedVariantData.image = variantImage;
      }
      console.log(`req.file.path:${updatedVariantData.image}`);
      // Find the product by productId
      const product = await Product.findOne({ productId: productId });

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      // Update the specific variant
      product.variants[variantIndex] = updatedVariantData;

      // Create an audit log entry for updating variant
      const userId = req.user.userId;
      const auditLog = new AuditLog({
        admin: userId,
        action: "Update Product Variant",
        details: `updated the info of variant ${variantId} of product ${product.productId}`,
      });

      // Save the audit log entry
      await auditLog.save();

      // Save the updated product
      const updatedProduct = await product.save();

      res.status(200).json(updatedProduct);
      console.log(
        `Variant ${variantIndex} updated successfully:`,
        updatedProduct
      );
    } catch (error) {
      console.error(`Error updating variant:`, error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//Update Product Stock
productRouter.put(
  "/updateStock/:productId/:variantId",
  isAuth,
  async (req, res) => {
    try {
      const { newStock } = req.body;
      const { productId, variantId } = req.params;

      const product = await Product.findOneAndUpdate(
        { productId: productId, "variants.variantId": variantId },
        { $set: { "variants.$.stock": newStock } },
        { new: true }
      );

      if (product) {
        await product.save();

        // Create an audit log entry for updating stock
        const userId = req.user.userId;
        const auditLog = new AuditLog({
          admin: userId,
          action: "Update Product Stock",
          details: `updated the stock of variant ${variantId} of product ${product.productId}`,
        });

        // Save the audit log entry
        await auditLog.save();
        res.json({
          message: "Stock updated successfully",
          updatedProduct: product,
        });
      } else {
        return res.status(404).json({ message: "Product not found." });
      }
    } catch (err) {
      console.error("Error updating stock:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

//Delete one product
productRouter.delete("/:productId", isAuth, async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findOneAndDelete({ productId: productId });
    if (product) {
      // Create an audit log entry for deleting product
      const userId = req.user.userId;
      const auditLog = new AuditLog({
        admin: userId,
        action: "Delete Product",
        details: `deleted the product ${product.productId}`,
      });

      // Save the audit log entry
      await auditLog.save();
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete a variant of one product
productRouter.delete(
  "/removeVariant/:productId/:variantId",
  isAuth,
  async (req, res) => {
    try {
      const { productId, variantId } = req.params;

      // Fetch the product by productId
      const product = await Product.findOneAndUpdate({ productId: productId });

      // Check if the product and variantId are valid
      if (!product || !variantId) {
        return res
          .status(404)
          .json({ message: "Product or variant not found" });
      }

      product.variants = product.variants.filter(
        (variant) => variant.variantId !== variantId
      );

      // Save the updated product
      await product.save();
      // Create an audit log entry for deleting product
      const userId = req.user.userId;
      const auditLog = new AuditLog({
        admin: userId,
        action: "Delete Variant",
        details: `deleted the variant ${variantId} of product ${product.productId}`,
      });
      // Save the audit log entry
      await auditLog.save();

      // Respond with the removed variant
      res.json({ message: "Variant removed successfully", removedVariant: { variantId } });
    } catch (error) {
      console.error("Error removing variant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = productRouter;
