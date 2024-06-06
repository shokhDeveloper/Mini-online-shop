import { adminToken } from "#adminVerifyToken";
import { productController } from "#controller/productController.js";
import { productImageValidator, updateProductImageValidator } from "#validator";
import e from "express";
export const productRouter = e.Router();

productRouter.route("/").get(productController.GET);
productRouter.route("/add").post(adminToken, productImageValidator, productController.POST);
productRouter.route("/:productId/image").get(productController.MEDIA.GET);
productRouter.route("/:productId").get(productController.GET).put(adminToken, updateProductImageValidator, productController.PUT).delete(adminToken, productController.DELETE);