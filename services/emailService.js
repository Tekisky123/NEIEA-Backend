import nodemailer from "nodemailer";
import donorDonationTemplate from "../templates/donorDonationTemplate.js";
import adminDonationTemplate from "../templates/adminDonationTemplate.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD.replace(/ /g, ""), // Remove any spaces from the password
  },
  tls: {
    rejectUnauthorized: false, // This might help with self-signed certificates
  },
});

const sendDonationEmail = async (donation) => {
  const donorMailOptions = {
    from: `"NEIEA" <${process.env.SMTP_EMAIL}>`,
    to: donation.email,
    subject: "Thank You for Your Donation",
    html: donorDonationTemplate(donation),
  };

  const adminMailOptions = {
    from: `"NEIEA" <${process.env.SMTP_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Donation Received",
    html: adminDonationTemplate(donation),
  };

  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
    await transporter.sendMail(donorMailOptions);
    console.log("Donor email sent successfully");
    await transporter.sendMail(adminMailOptions);
    console.log("Admin email sent successfully");
  } catch (error) {
    console.error("Error sending donation emails:", error);
  }
};

export default sendDonationEmail;
