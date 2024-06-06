import fs from "node:fs";
import { ClientError, ServerError, globalError } from "#error";
import { tokenConfig } from "#jwt";
import { fetch, getUsers, insertProduct, updateProduct, updateUser } from "#postgreSQL";

import path from "node:path";
import { serverConfiguration } from "#config";
export const model = (req, res, next) => {
    req.fetch = fetch;
    req.toCheckUser = async function(newUser, type){
        const condition = (user) => user.email == newUser.email;
        try{
            const users = await getUsers();
            if(!users.some(condition) && type == "register") return true;
            if(users.some(condition) && type == "register") return false;
            if(users.some(condition) && type == "login") return {type: true, index: users.findIndex(condition), user: users.find(condition)};
            if(!users.some(condition) && type == "login") return false; 
        }catch(error){
            return globalError(res, error)
        }
    },
    req.insertUser = async function(newUser){
        try{
            const {user_first_name, user_last_name, email, password, confirm_password} = newUser;
            const avatar = req.avatarName;
            if(password === confirm_password){
                const insertUser = await req.fetch(`
                INSERT INTO users (user_first_name, user_last_name, email, password, confirm_password, avatar)
                VALUES($1, $2, $3, crypt($4, gen_salt('bf')), crypt($5, gen_salt('bf')), $6) 
                RETURNING 
                user_id,
                user_first_name, 
                user_last_name, 
                email, 
                password 
                ;
                `, true, user_first_name, user_last_name, email, password, confirm_password, avatar);    
                if(insertUser.email){
                    if(req.files) req.files.avatar.mv(avatar)
                    return res.status(201).json({message: "The user successfull registreed !", user: insertUser, accessToken: tokenConfig.createToken({user_id: insertUser.user_id, client: true, userAgent: req.headers["user-agent"]}, process.env.TOKEN_KEY), statusCode: 201});
                }
            } else throw new ClientError(400, "Password and confirm password values must be the same")
        }catch(error){
            return globalError(res, error)
        };
    };
    req.insertProduct = async function(product_image){
        try{
            const {product_name, product_price, category_id} = req.body;
                const {product_image:{mv}} = req.files;
                const pathname = path.join(process.cwd(), "uploads", product_image);
                const insertProductRes = await insertProduct(product_name, product_price, category_id, pathname);    
                if(insertProductRes.product_id) {
                    mv(pathname);
                    return res.status(201).json({message: "The product successfully created !", product: insertProductRes, statusCode: 201});
                }else throw new ServerError("PostgreSQL failed to create product (file) !")
        }catch(error){
            return globalError(res, error)
        };
    },
    req.sendUserAvatar = function(){
        try{
           const exists = fs.existsSync(serverConfiguration.adminImagePath);
           if(exists) return res.sendFile(serverConfiguration.adminImagePath); 
           else throw new ServerError("Admin image is not found");
        }catch(error){
            return globalError(res, error);
        }
    },
    req.updateUser = async function(...values){
        try{
            if(req.files){
                const updateUserRes = await updateUser(req.user_id, ...values );
                if(updateUserRes && Object.keys(updateUserRes).length) return res.status(200).json({message: "User successfully updated !", statusCode: 200, updateUser: updateUserRes})
                else throw new ServerError("Update error");
            }else{
                const updateUserRes = await updateUser(req.user_id, ...values, undefined);
                if(updateUserRes && Object.keys(updateUserRes).length) return res.status(200).json({message: "User successfully updated !", statusCode: 200, updateUser: updateUserRes})
                else throw new ServerError("Update error");
            }
        }catch(error){
            return globalError(res, error)
        }
    }
    return next()
}