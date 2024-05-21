import { adminToken } from "#adminVerifyToken";
import { categoryController } from "#controller/categoryController.js";
import e from "express";
export const categoryRouter = e.Router();
categoryRouter.route("/").get(adminToken, categoryController.GET);