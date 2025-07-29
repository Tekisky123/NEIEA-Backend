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
  getAllInstitutions,
  createOrUpdateCarousel,
  addVideoCard,
  updateVideoCard,
  deleteVideoCard,
  
  addHeroSection,
  updateHeroSection,
  deleteHeroSection,
  
  addBulletPoint,
  updateBulletPoint,
  deleteBulletPoint,
  
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload, { uploadCarouselImages } from '../middleware/upload.js';

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
adminRoutes.put('/courses/edit/:courseId', protect, upload, updateCourse);

adminRoutes.get('/donors', protect, getAllDonors);
adminRoutes.get('/institutions', protect, getAllInstitutions);

adminRoutes.delete('/courses/delete/:courseId', protect, deleteCourse);
adminRoutes.post('/carousel', protect, uploadCarouselImages, createOrUpdateCarousel);

adminRoutes.post('/video-cards', protect, addVideoCard);
adminRoutes.put('/video-cards/:id', protect, updateVideoCard);
adminRoutes.delete('/video-cards/:id', protect, deleteVideoCard);

adminRoutes.post('/hero-section', protect, addHeroSection);
adminRoutes.put('/hero-section/:id', protect, updateHeroSection);
adminRoutes.delete('/hero-section/:id', protect, deleteHeroSection);

adminRoutes.post('/bullet-points', protect, addBulletPoint);
adminRoutes.put('/bullet-points/:id', protect, updateBulletPoint);
adminRoutes.delete('/bullet-points/:id', protect, deleteBulletPoint);

adminRoutes.post('/testimonials', protect, addTestimonial);
adminRoutes.put('/testimonials/:id', protect, updateTestimonial);
adminRoutes.delete('/testimonials/:id', protect, deleteTestimonial);

export default adminRoutes;
