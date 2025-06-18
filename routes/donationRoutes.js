import express from "express";
import {
  createDonation,
  getAllDonations,
  getOneDonation,
  verifyPayment,
} from "../controllers/donationController.js";

const router = express.Router();

router.get("/getAllDonationDetails", getAllDonations);
router.get("/getOneDonation/:id", getOneDonation);
router.post("/create-donation", createDonation);

// Verify payment and create donation
router.post("/verify-payment", verifyPayment);

export default router;
