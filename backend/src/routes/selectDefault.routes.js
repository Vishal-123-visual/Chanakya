import { Router } from "express";
import {
  addDefaultSelectController,
  getAllDefaultSelectController,
  getSingleDefaultSelectByIdController,
  updateSingleDefaultSelectController,
} from "../controllers/customField/defaultSelect.controllers.js";

const router = Router();

router
  .route("/")
  .post(addDefaultSelectController)
  .get(getAllDefaultSelectController);
router
  .route("/:id")
  .get(getSingleDefaultSelectByIdController)
  .put(updateSingleDefaultSelectController);

export default router;
