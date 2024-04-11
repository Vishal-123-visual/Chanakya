import { Router } from "express";
import {
  addSubjectController,
  getCourseSubjectsListsController,
  updateCourseSubjectController,
  deleteCourseSubjectController,
} from "../controllers/subject.controllers.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/")
  .post(requireSignIn, isAdmin, addSubjectController)
  .get(requireSignIn, isAdmin, getCourseSubjectsListsController);
router
  .route("/:id")
  .put(requireSignIn, isAdmin, updateCourseSubjectController)
  .delete(requireSignIn, isAdmin, deleteCourseSubjectController);

export default router;
