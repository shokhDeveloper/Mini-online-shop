import { ClientError, globalError } from "#error"
import { tokenConfig } from "#jwt";
import { getAdmins, getUsers } from "#postgreSQL";

export const authToken = async (req, res, next) => {
    try{
        const users = await getUsers();
        const admins = await getAdmins();
        const token = req.headers.token;
        if(!token) throw new ClientError(499, "Token is required !");
        if(token){
            const verifyToken = tokenConfig.parsedToken(token, process.env.TOKEN_KEY);
            if(!verifyToken) throw new ClientError(499, 'Token is required');
            if(verifyToken.client){
                if(!users.some((user) => user.user_id == verifyToken.user_id) || !(verifyToken.userAgent == req.headers["user-agent"])) throw new ClientError(498, "Invalid token !"); 
                req.user_id = verifyToken.user_id;
                return next();
            }
            if(verifyToken.admin){
                const {admin_id, userAgent} = verifyToken   
                if(!admins.some((admin) => admin.admin_id == admin_id) || !(req.headers["user-agent"] == userAgent)) throw new ClientError(498, "Invalid token !");
                return next();
            }
        }
    }catch(error){
        console.log(error)
        return globalError(res, error);
    }
}