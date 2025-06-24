import express from "express";
import {
  getAllCoursesPublic,
  getCourseById,
  applyToCourse,
} from "../controllers/courseController.js";

const courseRoutes = express.Router();

courseRoutes.get("/getAllCourses", getAllCoursesPublic); // Get all courses
courseRoutes.get("/getOneCourse/:id", getCourseById); // Get single course by ID
courseRoutes.post("/apply/:id", applyToCourse); // Apply to course

export default courseRoutes;
