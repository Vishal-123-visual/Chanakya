import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addDayBookAccountController,
  getDayBookAccountsListsController,
  deleteDayBookAccountsListDataController,
} from "../controllers/dayBook/dayBookAccount.controllers.js";

const router = Router();

router.get("/", requireSignIn, getDayBookAccountsListsController);
router.delete(
  "/:id",
  requireSignIn,
  isAdmin,
  deleteDayBookAccountsListDataController
);
router.post("/addAccount", requireSignIn, isAdmin, addDayBookAccountController);

export default router;
