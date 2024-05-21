import { adminToken } from "#adminVerifyToken";
import { productController } from "#controller/productController.js";
import e from "express";
export const productRouter = e.Router();

productRouter.route("/").get(adminToken, productController.GET);