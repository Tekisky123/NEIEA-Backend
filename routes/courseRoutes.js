import express from "express";
import {
  getAllCoursesPublic,
  getCourseById,
  applyToCourse,
  InstitutionApplyToCourse
} from "../controllers/courseController.js";
import { uploadInstitutionFiles } from "../middleware/upload.js";

const courseRoutes = express.Router();

courseRoutes.get("/getAllCourses", getAllCoursesPublic); // Get all courses
courseRoutes.get("/getOneCourse/:id", getCourseById); // Get single course by ID
courseRoutes.post("/apply/:id", applyToCourse); // Apply to course
courseRoutes.post("/apply-institution", uploadInstitutionFiles,InstitutionApplyToCourse); // Apply to course

export default courseRoutes;
