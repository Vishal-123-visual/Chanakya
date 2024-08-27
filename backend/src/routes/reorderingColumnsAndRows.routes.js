import { Router } from "express";
import {
  saveReorderedColumns,
  getColumns,
} from "../controllers/customField/columns.controller.js";
import {
  saveReorderedRows,
  getRows,
  deleteRow,
} from "../controllers/customField/rows.controller.js";

const router = Router();

// Route for saving reordered columns
router.post("/columns/save", saveReorderedColumns).get("/columns", getColumns);
router.post("/rows/save", saveReorderedRows).get("/rows", getRows);
router.route("/:id").delete(deleteRow);
export default router;
