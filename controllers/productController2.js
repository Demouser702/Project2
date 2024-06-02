const Product = require("../models/Product");
const dotenv = require("dotenv");
const Joi = require("joi");
const moment = require("moment");
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

exports.fetchProduct = async (req, res) => {
  const productName = req.query;
  const regexProductName = escapeRegex(productName);
  if (!productName) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Please add Product Name",
    });
    const data = await Product.find();
  }
  exports.listProducts = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const products = await Product.find().skip(skip).limit(limit).exec();
      const response = products
        .filter((prod) => moment(prod.date).format("DD/MM/YYYY") === date)

        .sort((a, b) => b.date - a.date);
      console.log("products:", products);

      if (!products || products.length === 0) {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: "No products to display",
        });
      }
      res.status(200).json({
        status: "Success",
        data: {
          products: products,
          totalPages: Math.ceil(products / limit),
          currentPage: page,
        },
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res
        .status(500)
        .json({ message: "Error fetching products from the database" });
    }
  };

  exports.listProductsByQuery = async (req, res) => {
    try {
      const { query, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const filter = {};
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { categories: { $regex: query, $options: "i" } },
        ];
      }

      const products = await Product.find(filter)
        .skip(skip)
        .limit(limit)
        .exec();
      const totalProducts = await Product.countDocuments(filter);

      if (!products || products.length === 0) {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: "No products to display",
        });
      }
      res.status(200).json({
        status: "Success",
        data: {
          products: products,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
        },
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res
        .status(500)
        .json({ message: "Error fetching products from the database" });
    }
  };
};
exports.fetchProduct = async (req, res) => {
  const productName = req.query;
  const regexProductName = escapeRegex(productName);
  if (!productName) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Please add Product Name",
    });
    const data = await Product.find();
  }
};
