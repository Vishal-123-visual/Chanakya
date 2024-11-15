import { Router } from "express";
import {
  postApprovalController,
  getAllApprovalStatusController,
  // deleteSingleApprovalDataController,
} from "../controllers/approval.controllers.js";

const router = Router();

router
  .route("/")
  .post(postApprovalController)
  .get(getAllApprovalStatusController);

// router.route("/:id").delete(deleteSingleApprovalDataController);

export default router;
