import Course from "../models/Course.js";
import Applicant from "../models/Applicant.js";
import validator from 'validator';


export const getAllCoursesPublic = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select("-applicants");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const applyToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      phone,
      motherTongue,
      age,
      gender,
      isStudent,
      classStudying,
      state,
      city,
      whatsappNumber,
      referredBy,
      convenientTimeSlot,
      message
    } = req.body;

    // Basic validation for required fields
    if (
      !fullName || !email || !phone || !motherTongue || !age || !gender ||
      !isStudent || !state || !city || !whatsappNumber || !referredBy ||
      !convenientTimeSlot
    ) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email." });
    }

    // Validate phone number format
    if (!validator.isMobilePhone(phone)) {
      return res.status(400).json({ message: "Please provide a valid phone number." });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found or inactive" });
    }

    // Save application with all fields
    const applicant = new Applicant({
      course: course._id,
      fullName,
      email,
      phone,
      motherTongue,
      age,
      gender,
      isStudent,
      classStudying: isStudent === "Yes" ? classStudying : undefined,
      state,
      city,
      whatsappNumber,
      referredBy,
      convenientTimeSlot,
      message: message || "",
    });

    await applicant.save();

    // Optionally, push applicant to course.applicants array
    course.applicants.push(applicant._id);
    await course.save();

    res.status(201).json({ message: "Application submitted successfully", applicant });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(400).json({ message: "You have already applied to this course." });
    }
    res.status(500).json({ message: error.message });
  }
};


