import { IP_ADDRESS } from "#network";
import dotenv from "dotenv"
const PORT = process.env.PORT || 3000;

export const serverConfiguration = {
  PORT,
  ip_address: IP_ADDRESS || "localhost",
  token_limit: "20d",
  avatar_formats: [".jpg", ".png", ".jpeg"]
};

dotenv.config();