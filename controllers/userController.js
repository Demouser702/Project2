const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const Joi = require("joi");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const sendEmailTo = require("../helpers/sendEmail");

dotenv.config();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

const validateAuthSchemaSignup = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};

const validateAuthSchemaLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};
exports.signup = async (req, res) => {
  const { error } = validateAuthSchemaSignup(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).send("Email in use");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuid.v4();

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    await newUser.save();
    const verificationLink = `http://localhost:8080/api/users/verify/${verificationToken}`;
    sendEmailTo(newUser.email, verificationLink);

    res.status(201).json({
      message: "User created successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
        verificationToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating the user");
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = validateAuthSchemaLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Email or password is wrong");
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    const userId = user._id;
    console.log(userId);
    const filter = { email: user.email };
    const update = {
      $set: {
        token: token,
      },
    };

    await User.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
      },
      verificationToken: user.verificationToken,
      verify: user.verify,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Login error");
  }
};
exports.updateUserInfo = async (req, res) => {
  try {
    const { age, height, bloodType, currentWeight, targetWeight } = req.body;
    if (!age || !bloodType || !currentWeight || !targetWeight || !height) {
      return res.status(400).json({
        message: "Age, bloodType, currentWeight, targetWeight are required",
      });
    }
    const user = req.user;
    if (!user) {
      return res.status(401).send("Not authorized to update user information");
    }
    user.height = height;
    user.age = age;
    user.bloodType = bloodType;
    user.currentWeight = currentWeight;
    user.targetWeight = targetWeight;
    await user.save();
    res.status(200).json({
      message: "User information updated successfully",
      user: {
        email: user.email,
        age: user.age,
        height: user.height,
        bloodType: user.bloodType,
        currentWeight: user.currentWeight,
        targetWeight: user.targetWeight,
      },
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Error updating user information");
  }
};
exports.updateUserInfo1 = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("userId", userId);
    const { age, height, bloodType, currentWeight, targetWeight } = req.body;
    if (!age || !bloodType || !currentWeight || !targetWeight) {
      return res.status(400).json({
        message: "Age, bloodType, currentWeight, targetWeight are required",
      });
    }
    await User.findByIdAndUpdate(userId, {
      age,
      height,
      bloodType,
      currentWeight,
      targetWeight,
    });
    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).end();
};
exports.verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.query; // Extracting the verificationToken from query parameters

    // Check if the verification token is provided
    if (!verificationToken) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Missing required field email" });
    }
    const user = await User.findOne({ email });
    console.log(user);

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const verificationToken = uuid.v4();
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `http://localhost:8080/api/users/verify/${verificationToken}`;
    sendEmailTo(user.email, verificationLink);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
exports.current = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).send("Not authorized");
    }

    res.status(200).json({
      email: user.email,
    });
  } catch (error) {
    res.status(500).send("Extracting current user error");
  }
};
