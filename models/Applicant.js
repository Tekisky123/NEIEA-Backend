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
  phone: String,
  message: String,
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Applicant", applicantSchema);
