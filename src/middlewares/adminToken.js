import { ClientError, globalError } from "#error";
import { tokenConfig } from "#jwt"
import { getAdmins } from "#postgreSQL";

export const adminToken = async (req, res, next) => {
    try{    
        const verifyToken = tokenConfig.parsedToken(req.headers.token, process.env.TOKEN_KEY);
        if(verifyToken.admin){
            const admins = await getAdmins() 
            const {admin_id, userAgent} = verifyToken   
            if(!admins.some((admin) => admin.admin_id == admin_id) || !(req.headers["user-agent"] == userAgent)) throw new ClientError(498, "Invalid token ! Only admin can send request to this route !");
            return next();
        }else throw new ClientError(498, "Invalid token ! Only admin can send request to this route !");
    }catch(error){
        return globalError(res, error);
    }
}
