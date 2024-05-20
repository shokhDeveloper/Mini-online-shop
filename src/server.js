import express from "express";
import { serverConfiguration } from "#config";
import { authRouter } from "#router/authRouter.js";
import { model } from "#middlewares";
import fileUpload from "express-fileupload";
import { authToken } from "#verifyToken";
import { usersRouter } from "#router/usersRouter.js";
const {PORT, ip_address} = serverConfiguration;

const app = express();
app.use(fileUpload());
app.use(express.json());
app.use(model);

app.use("/auth", authRouter);

app.use(authToken);

// Client Routes

// Admin Routes
app.use("/users", usersRouter)

app.listen(PORT, () => {
    console.log(`Server is running http://${ip_address}:${PORT}`);
});