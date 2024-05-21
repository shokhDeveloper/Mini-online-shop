import { ClientError } from "#error";
import { serverConfiguration } from "#config";
import path from "node:path";
import Joi from "joi"
let email = Joi.string().max(32).pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).error(() => new Error("Email is required"));
let password = Joi.string().min(5).max(16).required().error(() => new Error("Password is required !"));
export const userValidator = Joi.object({
    user_first_name: Joi.string().required().max(32).error(() => new Error("First name is required !")),
    user_last_name: Joi.string().required().max(32).error(() => new Error("Last name is required !")),
    email,
    password,
    confirm_password: Joi.string().min(5).max(16).required().error(() => new Error("Confirm password is required !"))
});
export const LoginValidator = Joi.object({
    email,
    password
});
export const AdminValidator = Joi.object({
    admin_username: Joi.string().required().max(32).error(() => new Error("First name is required !")),
    admin_password: Joi.string().min(5).max(16).required().error(() => new Error("Password is required !")),
    admin_confirm_password: Joi.string().min(5).max(16).required().error(() => new Error("Confirm password is required !"))
});
export const avatarValidator = (req, res, next) => {
    try{
        if(req.files){
            const {avatar:{name, size}} = req.files;
            const fileSize = size / 1024 ** 2;
            if(7 < fileSize) throw new ClientError(413, "Avatar size must not exceed 7mb");
            let filename = name.replaceAll(" ", "");
            const extname = path.extname(filename);
            if(!serverConfiguration.avatar_formats.includes(extname)) throw new ClientError(415, "The program does not support the avatar format !");
            const pathname = path.join(process.cwd(), "uploads", filename);
            req.avatarName = pathname
            return next()
        }else{
            const {user_last_name} = req.body;
            if(user_last_name[user_last_name.length-1] == "a") req.avatarName = "https://bootdey.com/img/Content/avatar/avatar3.png";
            else req.avatarName = "https://bootdey.com/img/Content/avatar/avatar6.png";
            return next();
        }
    }catch(error){
        console.log(error)
        return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
    }
}
export const productValidator = Joi.object({
    product_name: Joi.string().max(32).error(() => new Error("Product name is required !")).required(),
    product_price: Joi.number().error(() => new Error("Product price is required !")).required(),
    product_image: Joi.string().max(500).error(() => new Error("Product image is required")).required(),
    categoryId: Joi.number().error(() => new Error("Category is is required")).required(),
    product_date: Joi.date().error(() => new Error("Product date is required !")).required() 
});
