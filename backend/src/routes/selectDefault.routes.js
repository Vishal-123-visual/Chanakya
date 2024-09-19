import { Router } from "express";
import {
  addDefaultSelectController,
  getAllDefaultSelectController,
  getSingleDefaultSelectByIdController,
  updateSingleDefaultSelectController,
} from "../controllers/customField/defaultSelect.controllers.js";
import { requireSignIn } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .post(addDefaultSelectController)
  .get(requireSignIn, getAllDefaultSelectController);
router
  .route("/:id")
  .get(requireSignIn, getSingleDefaultSelectByIdController)
  .put(requireSignIn, updateSingleDefaultSelectController);

export default router;
