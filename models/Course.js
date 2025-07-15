import mongoose from 'mongoose';
import validator from 'validator';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v), // Ensures valid URL format
      message: 'Photo URL must be a valid URL'
    },
    default: "https://img.freepik.com/free-photo/learning-education-ideas-insight-intelligence-study-concept_53876-120116.jpg?semt=ais_hybrid&w=740"
  },
  instructor: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ["beginner", "intermediate", "advanced"],
  },
  duration: {
    type: String,
    required: true,
  },
  targetAudience: {
    type: [String], // Assuming target audience can be an array of strings
    required: true,
    validate: {
      validator: (audience) => audience.length > 0, // Ensures the array is not empty
      message: 'Target audience must not be empty'
    }
  },
  fees: {
    type: Number,
    required: true,
    min: [0, 'Fees must be a positive number'] // Ensures fees are not negative
  },
  whatsappLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'WhatsApp link must be a valid URL'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',
  }],
  institutions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
  },
  ],
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;
