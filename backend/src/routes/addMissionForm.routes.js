import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import { createAddMissionController } from "../controllers/addmission.controllers.js";
import upload from "../../multer-config/storageConfig.js";

const router = Router();

router
  .route("/")
  .post(
    requireSignIn,
    isAdmin,
    upload.single("image"),
    createAddMissionController
  );

export default router;
