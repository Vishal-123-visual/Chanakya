import { Router } from "express";
import { addTrainerDataController } from "../controllers/attendance/addTrainers.controllers.js";

const router = Router();

router.route("/").post(addTrainerDataController);

export default router;
