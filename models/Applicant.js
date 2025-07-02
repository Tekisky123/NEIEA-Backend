import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  isStudent: {
    type: String,
    required: true,
  },
  classStudying: {
    type: String,
    required: true,
  },
  motherTongue: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  referredBy: {
    type: String,
    required: true,
  },
  convenientTimeSlot: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Applicant", applicantSchema);
