import { Router } from "express";
import {
  addCustomFieldController,
  deleteSingleFieldById,
  getAllCustomFieldController,
} from "../controllers/customField/customField.controllers.js";

const router = Router();

router
  .route("/")
  .post(addCustomFieldController)
  .get(getAllCustomFieldController);

router.route("/:id").delete(deleteSingleFieldById);

export default router;
