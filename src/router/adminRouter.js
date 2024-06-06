import { updateAdmin } from "#updateAdmin";
import { adminToken } from "#adminVerifyToken";
import { adminController } from "#controller/adminController.js";
import e from "express";
import { updateAdminImageValidator } from "#validator";
export const adminRouter = e.Router();
adminRouter.route("/").get(adminToken, adminController.GET).put(adminToken, updateAdmin, updateAdminImageValidator, adminController.PUT);
adminRouter.route("/image").get(adminToken, adminController.MEDIA.GET)