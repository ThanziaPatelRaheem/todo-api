import { body, param } from "express-validator";

export const allTasksValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("isCompleted")
    .isBoolean()
    .withMessage("isCompleted must be a boolean value"),
  body("dueDate")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format. Please use (YYYY-MM-DD)."),
];

export const taskIdValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];
