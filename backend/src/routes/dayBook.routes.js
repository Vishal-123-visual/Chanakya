import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addDayBookAccountController,
  getDayBookAccountsListsController,
  deleteDayBookAccountsListDataController,
  updateDayBookAccountController,
  //  day book data controller start here
  addDayBookDataController,
  getDayBookDataController,
  getSingleDayBookDataController,
} from "../controllers/dayBook/dayBookAccount.controllers.js";

const router = Router();

router.get("/", requireSignIn, getDayBookAccountsListsController);
router.delete(
  "/:id",
  requireSignIn,
  isAdmin,
  deleteDayBookAccountsListDataController
);
router.put("/:id", requireSignIn, isAdmin, updateDayBookAccountController);
router.post("/addAccount", requireSignIn, isAdmin, addDayBookAccountController);

// day Book Data Start here ................................
router.get(
  "/singleAccountDayBookLists/:id",
  requireSignIn,
  getSingleDayBookDataController
);
router.post("/addData", requireSignIn, isAdmin, addDayBookDataController);
router.get("/data", requireSignIn, getDayBookDataController);

export default router;
