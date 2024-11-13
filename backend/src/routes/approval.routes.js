import { Router } from "express";
import {
  postApprovalController,
  getAllApprovalStatusController,
} from "../controllers/approval.controllers.js";

const router = Router();

router
  .route("/")
  .post(postApprovalController)
  .get(getAllApprovalStatusController);

export default router;
