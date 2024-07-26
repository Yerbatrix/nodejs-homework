const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

const { M_USER, M_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

async function sendEmail(html, subject, to) {
  try {
    const info = await transporter.sendMail({
      from: '"Yerbatrix NodeJS-homework-App" <Yerbatrix-NodeJS@ethereal.email>',
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
module.exports = { sendEmail };
