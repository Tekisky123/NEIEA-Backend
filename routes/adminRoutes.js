import express from 'express';
import {
  createAdmin,
  assignStudent,
  updateStudentProgress,
  createCourse,
  getAllCourses,
  getAllDonors,
  loginAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  updateCourse,
  deleteCourse,
  getAllInstitutions
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const adminRoutes = express.Router();

adminRoutes.post('/auth/login',  loginAdmin);
adminRoutes.post('/create-admin', protect, createAdmin);
adminRoutes.put('/edit/:id', protect, updateAdmin);
adminRoutes.delete('/delete/:id', protect, deleteAdmin);
adminRoutes.get('/getAll-admin', protect, getAllAdmins);
adminRoutes.get('/get-admin', protect, getAdmin);
adminRoutes.post('/assign-student', protect, assignStudent);
adminRoutes.put('/update-student-progress', protect, updateStudentProgress);
adminRoutes.post('/courses', protect, upload, createCourse);
adminRoutes.get('/courses', protect, getAllCourses);
adminRoutes.put('/courses/edit/:courseId', protect, updateCourse);
adminRoutes.delete('/courses/delete/:courseId', protect, deleteCourse);

adminRoutes.get('/donors', protect, getAllDonors);
adminRoutes.get('/institutions', protect, getAllInstitutions);

export default adminRoutes;
