import Donation from '../models/Donation.js';
import sendDonationEmail from '../services/emailService.js';

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    await sendDonationEmail(donation);
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single donation by ID
export const getOneDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.status(200).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
