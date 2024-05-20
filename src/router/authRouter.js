
import { authController } from "#controller/authController.js";
import { avatarValidator } from "#validator";
import e from "express";
export const authRouter = e.Router();

authRouter.route("/register").post(avatarValidator, authController.AUTH.CLIENT.REGISTER);
authRouter.route("/login").post(authController.AUTH.CLIENT.LOGIN);
authRouter.route("/admin/login").post(authController.AUTH.ADMIN.SIGN);