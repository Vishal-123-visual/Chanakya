import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addEmailRemainderController,
  addEmailSuggestionController,
  getEmailSuggestionController,
  getEmailRemainderTextController,
} from "../controllers/emailremainder.controllers.js";
const router = Router();

router.post("/status", requireSignIn, isAdmin, addEmailSuggestionController);
router.get("/status", requireSignIn, isAdmin, getEmailSuggestionController);
router.post("/", requireSignIn, isAdmin, addEmailRemainderController);
router.get("/", requireSignIn, getEmailRemainderTextController);

export default router;
