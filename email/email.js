const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

const { M_USER, M_PASS } = process.env;

console.log("M_USER:", M_USER);
console.log("M_PASS:", M_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

async function main(html, subject, to) {
  try {
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <mailguntest@ethereal.email>',
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
main("<b>Hello world?</b>", "Hello ✔", "ruszkowski.pobog@gmail.com").catch(
  console.error
);
