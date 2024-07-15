import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  getAllStudentsController,
  updateStudentController,
  deleteStudentController,
  getSingleStudentDetailsController,
  getAllStudentsMonthlyCollectionFeesController,
  getStudentsAccordingToCompanyController,
  addStudentComissionController,
  getStudentCommissionListsController,
  createAlertStudentPendingFeesController,
  getAlertStudentPendingFeesController,
  deleteAlertStudentPendingFeesController,
  updateAlertStudentPendingFeesController,
} from "../controllers/students.controllers.js";
import upload from "../../multer-config/storageConfig.js";

const router = Router();

// Student Commission Start here -------------------------------------
router.post(
  "/commission",
  requireSignIn,
  isAdmin,
  addStudentComissionController
);
router.get("/commission/:data", getStudentCommissionListsController);
// Student Commission End here ---------------------------------------

router.post(
  "/createAlertStudentPendingFees/add",
  requireSignIn,
  isAdmin,
  createAlertStudentPendingFeesController
);
router.get(
  "/createAlertStudentPendingFees/get",
  requireSignIn,
  isAdmin,
  getAlertStudentPendingFeesController
);
router.delete(
  "/createAlertStudentPendingFees/:id",
  requireSignIn,
  isAdmin,
  deleteAlertStudentPendingFeesController
);
router.put(
  "/createAlertStudentPendingFees/:id",
  requireSignIn,
  isAdmin,
  updateAlertStudentPendingFeesController
);

// get the student According to company wise
router.get("/company/:companyId", getStudentsAccordingToCompanyController);

// get all students
router.route("/").get(requireSignIn, getAllStudentsController);
router
  .route("/feesCollection")
  .get(requireSignIn, getAllStudentsMonthlyCollectionFeesController);
router
  .route("/:id")
  .get(requireSignIn, getSingleStudentDetailsController)
  .put(requireSignIn, isAdmin, upload.single("image"), updateStudentController)
  .delete(requireSignIn, isAdmin, deleteStudentController);

export default router;
