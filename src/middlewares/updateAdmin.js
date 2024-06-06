import { ClientError, globalError } from "#error"
import { getAdmins } from "#postgreSQL";

export const updateAdmin = async (req, res, next) => {
    try{
        const newAdminValues = req.body;
        const newAdminValuesKeys = Object.keys(newAdminValues);
        const admin = await getAdmins();
        for (const key of newAdminValuesKeys) {            
            if(!admin[0].hasOwnProperty(key)) throw new ClientError(400, "Admin keys is invalid ! (admin_username, admin_password, admin_confirm_password is required !)")
        };
        return next();
    }catch(error){
        return globalError(res, error);
    }
}