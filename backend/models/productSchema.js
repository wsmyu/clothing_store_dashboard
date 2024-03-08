const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  madeIn: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalStock: {
    type: Number, 
  },

  variants: [
    {
      variantId:{
        type:String,
        required:true,
        unique:true,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
});

// Middleware to calculate totalStock before saving
productSchema.pre("save", function (next) {
  this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
