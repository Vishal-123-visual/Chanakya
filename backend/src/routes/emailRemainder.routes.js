import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addEmailRemainderController,
  addEmailSuggestionController,
  getEmailSuggestionController,
  getEmailRemainderTextController,
  addEmailRemainderDatesController,
  getAllRemainderDatesController,
  addWelcomeEmailSuggestionController,
  getWelcomeEmailSuggestionController,
} from "../controllers/emailremainder.controllers.js";
const router = Router();

router.post("/status", requireSignIn, isAdmin, addEmailSuggestionController);
router.post(
  "/welcome/status",
  requireSignIn,
  isAdmin,
  addWelcomeEmailSuggestionController
);
router.get("/status", requireSignIn, isAdmin, getEmailSuggestionController);
router.get(
  "/welcome/status",
  requireSignIn,
  isAdmin,
  getWelcomeEmailSuggestionController
);
router.post("/remainder-dates", addEmailRemainderDatesController);
router.get("/remainder-dates", getAllRemainderDatesController);
router.post("/", requireSignIn, isAdmin, addEmailRemainderController);
router.get("/", requireSignIn, getEmailRemainderTextController);

export default router;
