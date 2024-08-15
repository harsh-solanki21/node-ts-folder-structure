import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { validateRegistration, validateLogin } from "../validators/auth.validator";

const router = express.Router();
const authController = new AuthController();

router.post("/register", validateRegistration, authController.register);

router.post("/login", authenticateJWT, validateLogin, authController.login);

export default router;
