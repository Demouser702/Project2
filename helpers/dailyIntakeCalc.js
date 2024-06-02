const dailyIntakeCalc = (height, age, currentWeight, targetWeight) => {
  const BMR = 655 + 10 * currentWeight + 1.9 * height - 4.6 * age;
  const dailyIntake = BMR - 161 - 10 * (currentWeight - targetWeight);
  return Math.floor(dailyIntake);
};
module.exports = dailyIntakeCalc;
