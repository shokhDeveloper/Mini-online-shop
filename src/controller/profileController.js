import fs from "node:fs";
import { ClientError, globalError } from "#error"
import { deleteShops, deleteUser, fetch, getUserFound, updateUser } from "#postgreSQL";
import path from "node:path";
import { serverConfiguration } from "#config";

export const profileController = {
    GET: async function(req, res){
        try{
            if(!req.user_id) throw new ClientError(400, "You are not a user");
            const profile = await fetch(`SELECT user_id, user_first_name, user_last_name, email, password from users WHERE user_id=$1;`, true, req.user_id);
            return res.status(200).json(profile);
        }catch(error){
            return globalError(res, error);
        }
    },
    UPDATE: async function(req, res){
        try{
          const updateUserValues = req.body;
          if(!req.user_id) throw new ClientError(400, "You are not a user");
          const user = await getUserFound(req.user_id);
          const updateUserKeys = Object.keys(updateUserValues);
          for (const key of updateUserKeys) {
            if(!user.hasOwnProperty(key)) throw new ClientError(400, "There are limited values that you can update. (user_first_name, user_last_name, email, password, avatar)")
          };
          if(updateUserValues.password && !updateUserValues.confirm_password) throw new ClientError(400, "Password confirmation is mandatory!")
            if(updateUserValues.password && updateUserValues.confirm_password && updateUserValues.password !== updateUserValues.confirm_password) throw new ClientError(400, "Confirm password error !")
            if(req.files){
                const image = user.avatar;
                serverConfiguration.userSetDefaultImage(image);
                const imagePath = path.join(process.cwd(), "uploads", Date.now() + req.files.avatar.name);
                req.files.avatar.mv(imagePath);
                return req.updateUser(updateUserValues.user_first_name, updateUserValues.user_last_name, updateUserValues.email, updateUserValues.password, updateUserValues.confirm_password, imagePath)
            }
            else{
                return req.updateUser(updateUserValues.user_first_name, updateUserValues.user_last_name, updateUserValues.email, updateUserValues.password, updateUserValues.confirm_password)
            }
        }catch(error){
          return globalError(res, error);
        }
    },
    DELETE: async function(req, res){
        try{
            if(!req.user_id) throw new ClientError(400, "You are not a user");
            console.log(req.user_id)
            const user = await getUserFound(req.user_id);
            if(user.avatar){
                const image = user.avatar.split("/").pop();
                if(image !== "avatar1.png"){
                    const exists = fs.existsSync(user.avatar);
                    if(exists) fs.unlinkSync(user.avatar);
                }
            }
            await deleteShops(req.user_id);
            const deleteUserRes = await deleteUser(req.user_id);
            if(deleteUserRes.password) return res.status(200).json({message: "Profile successfully deleted !", statusCode: 200, user: deleteUserRes});
        }catch(error){
            return globalError(res, error);
        }
    },
    MEDIA: {
        GET: async function(req, res){
            try{
                if(!req.user_id) throw new ClientError(400, "You are not a user");
                const user = await getUserFound(req.user_id);
                if(user.avatar){
                    const avatarPath = path.resolve(user.avatar);
                    const exists = fs.existsSync(avatarPath);                    
                    if(exists) return res.sendFile(avatarPath);
                    if(!exists) return res.status(400).json({message: "Image is not found"})
                };
            }catch(error){
                return globalError(res, error)
        }
        }
    }
}