import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createPaymentOptionController,
  getAllPaymentOptionsListController,
} from "../controllers/paymentoptions.controllers.js";

const router = Router();

router
  .route("/")
  .post(requireSignIn, isAdmin, createPaymentOptionController)
  .get(requireSignIn, getAllPaymentOptionsListController);

export default router;
