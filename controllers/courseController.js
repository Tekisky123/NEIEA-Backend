import Course from "../models/Course.js";
import Applicant from "../models/Applicant.js"; 

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
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply to a course (user submits application)
export const applyToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, message } = req.body;

    // Basic validation
    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found or inactive" });
    }

    // Save application (customize model fields as needed)
    const applicant = new Applicant({
      course: course._id,
      fullName,
      email,
      phone,
      message,
    });

    await applicant.save();

    // Optionally, push applicant to course.applicants array
    course.applicants.push(applicant._id);
    await course.save();

    res.status(201).json({ message: "Application submitted successfully", applicant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
