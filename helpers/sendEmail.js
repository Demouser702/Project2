require("dotenv").config();

function sendEmailTo(username, email, message) {
  const nodemailer = require("nodemailer");
  const nodemailerConfig = {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const mailOptions = {
    from: "roxana.orha@outlook.com",
    to: "roxanapascaru@gmail.com",
    subject: "Test Email",
    text: message || `Welcome ${username} to myApp!`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendEmailTo;
