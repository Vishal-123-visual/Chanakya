import { Router } from "express";
import {
  saveReorderedColumns,
  getColumns,
  deleteColumnsController,
} from "../controllers/customField/columns.controller.js";
import {
  saveReorderedRows,
  getRows,
  deleteRow,
} from "../controllers/customField/rows.controller.js";

const router = Router();

// Route for saving reordered columns
router.post("/columns/save", saveReorderedColumns).get("/columns", getColumns);
router.route("/:id").delete(deleteColumnsController);
router.post("/rows/save", saveReorderedRows).get("/rows", getRows);
router.route("/rows/:id").delete(deleteRow);
export default router;
