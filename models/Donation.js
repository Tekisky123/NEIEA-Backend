import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  amount: { type: Number, required: true },
  panCard: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', DonationSchema);

export default Donation;
