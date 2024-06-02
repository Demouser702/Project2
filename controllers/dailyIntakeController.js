const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const dailyIntakeCalc = require("../helpers/dailyIntakeCalc");
const dotenv = require("dotenv");
const Joi = require("joi");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

dotenv.config();

const validateUserData = (user) => {
  const schema = Joi.object({
    height: Joi.number().min(50).max(250).integer().required(),
    age: Joi.number().min(16).max(60).integer().required(),
    currentWeight: Joi.number().min(40).max(220).required(),
    targetWeight: Joi.number().min(20).max(220).required(),
    bloodType: Joi.number().valid(1, 2, 3, 4).required(),
  });

  return schema.validate(user);
};
exports.getDailyIntakePublic = async (req, res, next) => {
  try {
    const { error } = validateUserData(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { height, age, currentWeight, targetWeight, bloodType } = req.body;

    const dailyIntake = dailyIntakeCalc(
      height,
      age,
      currentWeight,
      targetWeight
    );

    const products = await Product.find({
      [`groupBloodNotAllowed.${bloodType}`]: true,
    });

    const notAllowedProducts = products.map(({ title }) => title);

    res.json({ dailyRate: dailyIntake, notRecFood: notAllowedProducts });
  } catch (error) {
    next(error);
  }
};
exports.getDailyIntakePrivate = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log("userId", userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { height, age, currentWeight, targetWeight, bloodType } = user;
    console.log(height, age, currentWeight, targetWeight, bloodType);
    const dailyIntake = dailyIntakeCalc(
      height,
      age,
      currentWeight,
      targetWeight
    );
    console.log(dailyIntake);
    const products = await Product.find({
      [`groupBloodNotAllowed.${bloodType}`]: true,
    });

    const notAllowedProducts = products.map(({ title }) => title);

    res.json({ dailyRate: dailyIntake, notRecFood: notAllowedProducts });
  } catch (error) {
    next(error);
  }
};
