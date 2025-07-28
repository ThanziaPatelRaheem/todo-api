import express from "express";
import { registerUser, userLogin } from "../controllers/authController.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../Validators/userValidationRules.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";

const router = express.Router();

router.post(
  "/register",
  userRegisterValidator,
  handleValidationErrors,
  registerUser
);

router.post("/login", userLoginValidator, userLogin);

export default router;
