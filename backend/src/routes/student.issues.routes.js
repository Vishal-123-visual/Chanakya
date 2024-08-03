import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addStudentIssueController,
  getAllStudentIssuesListsController,
  updateSingleStudentIssueController,
  deleteSingleStudentIssueController,
  updateStudentIssueNoteStatusController,
} from "../controllers/student.issues.controllers.js";

const router = Router();

// update the student show notes status
router.put("/updateStudentStatus/:id", updateStudentIssueNoteStatusController);

router
  .route("/")
  .get(requireSignIn, getAllStudentIssuesListsController)
  .post(requireSignIn, addStudentIssueController);

router
  .route("/:id")
  .put(updateSingleStudentIssueController)
  .delete(requireSignIn, isAdmin, deleteSingleStudentIssueController);

export default router;
