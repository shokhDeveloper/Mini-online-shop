import fs from "node:fs";
import { serverConfiguration } from "#config";
import { ClientError, ServerError, globalError } from "#error"
import { getAdmins, updateAdmin } from "#postgreSQL";
import path from "node:path";

export const adminController = {
    GET: async function(_, res){
        try{
            const admins = await getAdmins();
            return res.status(200).json(admins);
        }catch(error){
            return globalError(res, error);
        }
    },
    PUT: async function(req, res){
        try{
            const [admin] = await getAdmins();
            
            const {admin_username, admin_password, admin_confirm_password} = req.body;
            if(admin_password && admin_confirm_password && !(admin_password == admin_confirm_password)) throw new ClientError(400, "Passwords must be the same !");
            if(admin_password && !admin_confirm_password) throw new ClientError(400, "Passwords must be the same !");
            console.log(req.admin_image, req.files)
            if(req.admin_image && req.files){
                if(admin.admin_profile_image) serverConfiguration.userSetDefaultImage(admin.admin_profile_image);
                const newImagePath = path.join(process.cwd(), "uploads", req.admin_image)
                console.log(newImagePath);
                const adminUpdate = await updateAdmin(admin.admin_id, admin_username, admin_password, admin_confirm_password, newImagePath);   
                if(adminUpdate.admin_id) {
                    const {admin_profile_image:{mv}} = req.files;
                    mv(newImagePath);
                    return res.status(200).json({message: "Admin successfully updated", admin: adminUpdate})
                }
            }else{
                const adminUpdate = await updateAdmin(admin.admin_id, admin_username, admin_password, admin_confirm_password, req.admin_image);   
                if(adminUpdate.admin_id) return res.status(200).json({message: "Admin successfully updated", admin: adminUpdate})
            }
        }catch(error){
            return globalError(res, error);
        }
    },
    MEDIA:{
        GET: async function(_, res) {
            try{
                const [admin] = await getAdmins();
                if(!admin.admin_profile_image){
                    const adminByDefaultImage = serverConfiguration.adminImagePath;
                    return res.sendFile(adminByDefaultImage);
                }else {
                    const avatar = admin.admin_profile_image;
                    const exists = fs.existsSync(avatar);
                    if(exists) return res.sendFile(avatar);
                    else throw new ServerError("Admin Profile image is not found");
                }
            }catch(error){
                return globalError(res, error);
            }
        }
    }
}