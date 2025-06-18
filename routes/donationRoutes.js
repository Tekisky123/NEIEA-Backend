import express from 'express';
import { createDonation, getAllDonations, getOneDonation } from '../controllers/donationController.js';

const router = express.Router();

router.post('/donate', createDonation);
router.get('/getAllDonationDetails', getAllDonations);
router.get('/getOneDonation/:id', getOneDonation);

export default router;
