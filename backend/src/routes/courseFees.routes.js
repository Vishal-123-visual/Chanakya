import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createCourseFeesController,
  // getAllCourseFeesController,
  getSingleStudentCourseFeesController,
  updateSingleStudentCourseFeesController,
  deleteSingleStudentCourseFeesController,
  getCourseFeesByStudentIdController,
} from "../controllers/courseFees.controllers.js";
const router = Router();

router.post("/", requireSignIn, createCourseFeesController);
// router.route("/").get(requireSignIn, isAdmin, getAllCourseFeesController);

router
  .route("/:id")
  .get(requireSignIn, getSingleStudentCourseFeesController)
  .put(requireSignIn, isAdmin, updateSingleStudentCourseFeesController)
  .delete(requireSignIn, isAdmin, deleteSingleStudentCourseFeesController);

router.get(
  "/studentFees/:studentId",
  requireSignIn,
  getCourseFeesByStudentIdController
);

export default router;
