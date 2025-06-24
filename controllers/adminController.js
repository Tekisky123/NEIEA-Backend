import Admin from "../models/Admin.js";
import DonorUser from "../models/DonorUser.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import sendDonationEmail from "../services/emailService.js";
import jwt from "jsonwebtoken";
import sendProgressTemplate from "../templates/sendProgressTemplate.js";
import assignStudentTemplate from "../templates/assignStudentTemplate.js";
import ErrorResponse from "../utils/errorResponse.js";

export const createAdmin = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists with this email");
  }

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password,
    role: role || "admin",
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.user.id);

    console.log(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find();

    if (!admins || admins.length === 0) {
      return next(new ErrorResponse("No admins found", 404));
    }

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    next(new ErrorResponse("Server error while fetching admins", 500));
  }
};
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Find admin by email
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Create token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Set cookie options
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    // Send response with token and admin info
    res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
        },
      });
  } catch (err) {
    console.error("Admin login error:", err);
    next(new ErrorResponse("Server error during admin login", 500));
  }
};

// Update Admin
export const updateAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, role } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, role },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating admin" });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting admin" });
  }
};

// Assign a student to a donor
export const assignStudent = async (req, res) => {
  try {
    const { donorId, studentData } = req.body;
    const adminId = req.user.id;

    // Create a new student
    const student = new Student({ ...studentData, donor: donorId });
    await student.save();

    // Update the donor's students array with the new student's ID
    const donor = await DonorUser.findByIdAndUpdate(
      donorId,
      { $push: { students: student._id } },
      { new: true }
    );

    // Fetch the admin details
    const admin = await Admin.findById(adminId);

    if (donor) {
      // Send notification to donor
      await sendDonationEmail({
        type: "assignStudent",
        to: donor.email,
        subject: "Student Assigned",
        html: assignStudentTemplate(donor, studentData),
      });

      // Send notification to admin
      await sendDonationEmail({
        type: "assignStudent",
        to: admin.email,
        subject: "Student Assigned to Donor",
        html: assignStudentTemplate(donor, studentData),
      });
    }

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update student progress
export const updateStudentProgress = async (req, res) => {
  try {
    const { studentId, progressData } = req.body;

    // Ensure progressData includes the details
    if (!progressData.details) {
      return res.status(400).json({
        success: false,
        message: "Progress details are required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Add the progress details to the student's progress array
    student.progress.push({
      details: progressData.details,
      date: new Date(),
    });

    await student.save();

    const donor = await DonorUser.findById(student.donor);
    if (donor) {
      await sendDonationEmail({
        type: "progressUpdate",
        to: donor.email,
        subject: "Student Progress Update",
        html: sendProgressTemplate(donor, student, progressData.details),
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, duration, adminId } = req.body;
    const course = new Course({
      title,
      description,
      duration,
      createdBy: adminId,
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("applicants"); // ✅ now pulls full data
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donors
export const getAllDonors = async (req, res) => {
  try {
    // Fetch donors and populate the 'students' and 'donations' fields
    const donors = await DonorUser.find()
      .populate({
        path: "students",
        options: { sort: { createdAt: -1 } }, // Sort students by creation date, newest first
      })
      .populate("donations"); // Populate the donations field

    // Structure the response to include donor details, their assigned students, and total donation amount
    const responseData = donors.map((donor) => {
      // Calculate the total donation amount for the donor
      const totalDonationAmount = donor.donations.reduce((sum, donation) => {
        return sum + donation.amount;
      }, 0);

      return {
        _id: donor._id,
        firstName: donor.firstName,
        lastName: donor.lastName,
        email: donor.email,
        phone: donor.phone,
        donorType: donor.donorType,
        students: donor.students, // This will include the populated student details
        donations: donor.donations, // This will include the populated donation details
        totalDonationAmount, // Include the total donation amount
        createdAt: donor.createdAt,
        lastLogin: donor.lastLogin,
      };
    });

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
