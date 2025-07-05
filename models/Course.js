import mongoose from 'mongoose';
import validator from 'validator'

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

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',
  }],
});

const Course = mongoose.model('Course', CourseSchema);

export default Course;
