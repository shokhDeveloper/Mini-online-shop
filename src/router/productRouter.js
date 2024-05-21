import { adminToken } from "#adminVerifyToken";
import { productController } from "#controller/productController.js";
import { productImageValidator } from "#validator";
import e from "express";
export const productRouter = e.Router();

productRouter.route("/").get(adminToken, productController.GET);
productRouter.route("/add").post(adminToken, productImageValidator, productController.POST)