import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/taskController.js";
import auth from "../middleware/auth.js";
import {
  allTasksValidator,
  taskIdValidator,
} from "../Validators/taskValidationRules.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";
const router = express.Router();

router.get("/", auth, getAllTasks);
router.get("/:id", auth, taskIdValidator, handleValidationErrors, getTask);
router.post("/", auth, allTasksValidator, handleValidationErrors, createTask);
router.patch("/:id", auth, taskIdValidator, handleValidationErrors, updateTask);
router.delete(
  "/:id",
  auth,
  taskIdValidator,
  handleValidationErrors,
  deleteTask
);
export default router;
