import { Router } from "express";
import {
  addFormsController,
  deleteSingleFormById,
  editFormName,
  getAllAddedFormNames,
  getSingleFormController,
} from "../controllers/customField/addForms.controllers.js";

const router = Router();

router.route("/").post(addFormsController).get(getAllAddedFormNames);
router
  .route("/:id")
  .get(getSingleFormController)
  .put(editFormName)
  .delete(deleteSingleFormById);

export default router;
