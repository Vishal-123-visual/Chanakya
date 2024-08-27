import { Router } from "express";
import {
  submitFormController,
  getAllSubmitFormData,
  deleteSingleFormDataController,
  updateSingleFormDataValueController,
  getSingleFormDataValueByIdController,
} from "../controllers/submitForm.controllers.js";

const router = Router();

router.route("/").post(submitFormController).get(getAllSubmitFormData);
router
  .route("/:id")
  .delete(deleteSingleFormDataController)
  .get(getSingleFormDataValueByIdController)
  .put(updateSingleFormDataValueController);
// router.route("/:id").get(getSingle)

export default router;
