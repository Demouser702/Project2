const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    categories: {
      type: String,
    },
    title: { type: String, required: [true, "Product is required"] },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    calories: {
      type: Number,
      default: null,
    },
    groupBloodNotAllowed: {
      1: { type: Boolean, required: true },
      2: { type: Boolean, required: true },
      3: { type: Boolean, required: true },
      4: { type: Boolean, required: true },
    },
    consumed: [
      {
        consumedDate: { type: Date, default: Date.now },
        consumedWeight: { type: Number, required: true },
        consumedCalories: { type: Number, required: true },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
