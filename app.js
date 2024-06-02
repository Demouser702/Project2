require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const userRouter = require("./routes/userRouter.js");
const caloryRouter = require("./routes/caloryRouter.js");
// const productsRouter = require("./routes/productsRouter.js");
const { connectToDb } = require("./db");
const cors = require("cors");
const app = express();

const multer = require("multer");
const upload = multer({ dest: "public/avatars" }).single("avatar");

connectToDb();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", userRouter);
app.use("/api/calories", caloryRouter);
// app.use("/api/products", productsRouter);
app.use(upload);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
