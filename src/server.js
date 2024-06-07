import express from "express";
import cors from "cors";
import { serverConfiguration } from "#config";
import { authRouter } from "#router/authRouter.js";
import { model } from "#middlewares";
import fileUpload from "express-fileupload";
import { authToken } from "#verifyToken";
import { usersRouter } from "#router/usersRouter.js";
import { productRouter } from "#router/productRouter.js";
import { categoryRouter } from "#router/categoryRouter.js";
import { adminRouter } from "#router/adminRouter.js";
import { shopRouter } from "#router/shopRouter.js";
import { profileRouter } from "#router/profileRouter.js";
const {PORT, ip_address} = serverConfiguration;

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(model);
app.use(cors());

// Global Route
app.use("/auth", authRouter);

// To check token
app.use(authToken);
// Client Routes

app.use("/shops", shopRouter);
app.use("/profile", profileRouter);

// Admin Routes
app.use("/users", usersRouter);
app.use("/products", productRouter);    
app.use("/categories", categoryRouter);
app.use("/admins", adminRouter)
    
app.listen(PORT, () => {
    console.log(`Server is running http://${ip_address}:${PORT}`);
});