import { adminToken } from "#adminVerifyToken";
import { userController } from "#controller/userController.js";

import e from "express";
export const usersRouter = e.Router();

usersRouter.route("/").get(adminToken, userController.GET)