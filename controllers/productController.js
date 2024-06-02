const Product = require("../models/Product");
const dotenv = require("dotenv");
const Joi = require("joi");
const regex = require("regex");
const dailyIntake = require("../helpers/dailyIntakeCalc");

dotenv.config();

const validateProduct = (product) => {
  const schema = Joi.object({
    weight: Joi.number().positive().required(),
    productName: Joi.string().required(),
  });

  return schema.validate(user);
};
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

exports.addConsumedProduct = async (req, res) => {
  try {
    const { title, weight } = req.body;

    const { error } = validateConsumedProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const product = await Product.findOne({ title });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const caloriesConsumed = (product.calories * weight) / 100;

    product.consumed.push({
      consumedWeight: weight,
      consumedCalories: caloriesConsumed,
    });
    await product.save();

    res.status(201).json({ message: "Consumed product added successfully" });
  } catch (error) {
    console.error("Error adding consumed product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
