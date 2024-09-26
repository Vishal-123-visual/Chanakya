import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addEmailRemainderController,
  addEmailSuggestionController,
  getEmailSuggestionController,
  getEmailRemainderTextController,
  addEmailRemainderDatesController,
  getAllRemainderDatesController,
} from "../controllers/emailremainder.controllers.js";
const router = Router();

router.post("/status", requireSignIn, isAdmin, addEmailSuggestionController);
router.get("/status", requireSignIn, isAdmin, getEmailSuggestionController);
router.post("/remainder-dates", addEmailRemainderDatesController);
router.get("/remainder-dates", getAllRemainderDatesController);
router.post("/", requireSignIn, isAdmin, addEmailRemainderController);
router.get("/", requireSignIn, getEmailRemainderTextController);

export default router;
