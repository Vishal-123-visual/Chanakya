import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/", requireSignIn, isAdmin, addEmailRemainderController);

export default router;
