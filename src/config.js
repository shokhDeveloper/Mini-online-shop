import fs from "node:fs";
import { IP_ADDRESS } from "#network";
import dotenv from "dotenv"
import path from "node:path";
const PORT = process.env.PORT || 4000;

export const serverConfiguration = {
  PORT,
  ip_address: IP_ADDRESS || "localhost",
  token_limit: "20d",
  avatar_formats: [".jpg", ".png", ".jpeg", ".PNG", ".JPG", ".JPEG"],
  adminImagePath: path.join(process.cwd(), "uploads", "avatar1.png"),
  userSetDefaultImage(imagePath){
    const {base} = path.parse(imagePath);
    const defaultImages = ["avatar_j.png", "avatar_m.png", "avatar1.png"];
    let count = 0;
    for (const image of defaultImages) {
      if(image == base) count ++;
    }
    if(count == 0){
      fs.unlinkSync(imagePath);
    };
    return count === 0;
  }
};


dotenv.config();