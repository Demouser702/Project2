const mongoose = require("mongoose");

const dailyIntakeSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Product is required"] },
  weight: {
    type: Number,
    required: [true, "Grams field is required"],
  },

  calories: {
    type: Number,
    required: [true, "Calory field is required"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const dailyIntake = mongoose.model("dailyIntake", dailyIntakeSchema);

module.exports = dailyIntake;
