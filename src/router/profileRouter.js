import { profileController } from "#controller/profileController.js";
import e from "express";
export const profileRouter = e.Router();

profileRouter.route("/").get(profileController.GET).put(profileController.UPDATE)
.delete(profileController.DELETE);
profileRouter.route("/image").get(profileController.MEDIA.GET);