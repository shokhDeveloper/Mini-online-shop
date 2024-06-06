import { shopController } from "#controller/shopController.js";
import e from "express";
export const shopRouter = e.Router();

shopRouter.route("/").get(shopController.GET);
shopRouter.route("/:productId").post(shopController.POST)
shopRouter.route("/:shopId").delete(shopController.DELETE);
shopRouter.route("/:userId").get(shopController.GET);