import nodemailer from "nodemailer";
import donorDonationTemplate from "../templates/donorDonationTemplate.js";
import adminDonationTemplate from "../templates/adminDonationTemplate.js";
import donorAccountTemplate from "../templates/donorAccountTemplate.js"; // Import donor account template
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD?.replace(/ /g, ""),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send email based on type
 * @param {Object} params
 * @param {"donation"|"account"} params.type
 * @param {Object} params.data - donation or other data
 * @param {string} [params.password] - optional for account creation
 */
const sendDonationEmail = async ({ type, data, password }) => {
  if (!data || !data.email) {
    console.error("Cannot send email: Missing data or recipient email");
    return;
  }

  let mailOptions;

  switch (type) {
    case "donation":
      mailOptions = {
        from: `"NEIEA" <${process.env.SMTP_EMAIL}>`,
        to: data.email,
        subject: "Thank You for Your Donation",
        html: donorDonationTemplate(data),
      };
      break;

    case "account":
      mailOptions = {
        from: `"NEIEA" <${process.env.SMTP_EMAIL}>`,
        to: data.email,
        subject: "Your NEIEA Donor Account Details",
        html: donorAccountTemplate(data, password),
      };
      break;

    case "admin":
      mailOptions = {
        from: `"NEIEA" <${process.env.SMTP_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New Donation Received",
        html: adminDonationTemplate(data),
      };
      break;

    default:
      console.warn("Unknown email type:", type);
      return;
  }

  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");

    if (!mailOptions.to) throw new Error(`No recipient defined for ${type} email`);

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${type}`);
  } catch (error) {
    console.error(`❌ Error sending ${type} email:`, error.message || error);
  }
};

export default sendDonationEmail;