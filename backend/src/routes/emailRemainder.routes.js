import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import { addEmailRemainderController } from "../controllers/emailremainder.controllers.js";
const router = Router();

router.post("/", requireSignIn, isAdmin, addEmailRemainderController);

export default router;
