import { ClientError, globalError } from "#error";
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
            if(5 < fileSize) throw new ClientError(413, "Avatar size must not exceed 7mb");
            let filename = name.replaceAll(" ", "");
            const extname = path.extname(filename);
            if(!serverConfiguration.avatar_formats.includes(extname)) throw new ClientError(415, "The program does not support the avatar format !");
            const pathname = path.join(process.cwd(), "uploads", filename);
            req.avatarName = pathname
            return next()
        }else{
            const {user_last_name} = req.body;
            if(user_last_name[user_last_name.length-1] == "a") req.avatarName = path.join(process.cwd(), "uploads", "avatar_j.png");
            else req.avatarName = path.join(process.cwd(), "uploads", "avatar_m.png");
            return next();
        }
    }catch(error){
        console.log(error)
        return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
    }
}
export const productValidator = Joi.object({
    product_name: Joi.string().max(32).error(() => new Error("Product name is required !")).required(),
    product_price: Joi.string().error(() => new Error("Product price is required !")).required(),
    category_id: Joi.string().error(() => new Error("Category id is is required")).required()
});
export const productValidatorFromProductImage = Joi.object({
    product_name: Joi.string().max(32).error(() => new Error("Product name is required !")).required(),
    product_price: Joi.string().error(() => new Error("Product price is required !")).required(),
    category_id: Joi.string().error(() => new Error("Category id is is required")).required(),
    product_image: Joi.string().max(500).error(() => new Error("Product image is required !")).required()
});
const imageValidator = (req, next) => {
    const {product_image:{name, size}} = req.files;
    let product_name =  Date.now() + name.replaceAll(" ", "");
    const extname = path.extname(product_name);
    const fileSize = size / 1024 ** 2;
    if(fileSize > 5) throw new ClientError(413, "Product image size must not exeed 7mb");
    if(!serverConfiguration.avatar_formats.includes(extname)) throw new ClientError(415, "The program does not support the avatar format !");
    req.product_image = product_name;
    return next()
};
const adminImageValidator = (req, next) => {
    const {admin_profile_image:{name, size}} = req.files;
    let admin_profile_image =  Date.now() + name.replaceAll(" ", "");
    const extname = path.extname(admin_profile_image);
    const fileSize = size / 1024 ** 2;
    if(fileSize > 5) throw new ClientError(413, "Image size must not exeed 7mb");
    if(!serverConfiguration.avatar_formats.includes(extname)) throw new ClientError(415, "The program does not support the avatar format !");
    req.admin_image = admin_profile_image;
    return next()
};
export const productImageValidator = (req, res, next) => {
    try{
        if(req.files){
            return imageValidator(req, next);
        }else throw new ClientError(400, "Product image is required !");
    }catch(error){
        return globalError(res, error)
    }
};
export const updateProductImageValidator = (req, res, next) => {
    try{
        if(req.files){
            return imageValidator(req, next);
        }else return next();
    }catch(error){
        return globalError(res, error)
    }
};
export const updateAdminImageValidator = (req, res, next) => {
    try{
        if(req.files){
            return adminImageValidator(req, next);
        }else return next();
    }catch(error){
        return globalError(res, error)
    }
}