import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createCompanyController,
  getAllCompanyListsController,
  updateCompanyController,
  deleteCompanyController,
} from "../controllers/company.controllers.js";
import upload from "../../multer-config/storageConfig.js";

const router = Router();

router
  .route("/")
  .post(requireSignIn, isAdmin, upload.single("logo"), createCompanyController)
  .get(requireSignIn, getAllCompanyListsController);

router
  .route("/:id")
  .put(requireSignIn, isAdmin, updateCompanyController)
  .delete(requireSignIn, isAdmin, deleteCompanyController);

export default router;
