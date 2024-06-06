import fs from "node:fs";
import { globalError } from "#error"
import { fetch, getUserFound } from "#postgreSQL";

export const userController = {
    GET: async function(req, res){
        try{
            const {userId} = req.params;
            const {search, page=1 , limit=5 } = req.query;
            const searchUsers = `SELECT user_id, user_first_name, user_last_name, email from users 
            WHERE CASE WHEN $1 > 0 THEN user_id=$1 else true end
            and
            CASE WHEN LENGTH($2) > 0 THEN CONCAT(LOWER(user_first_name) || ' ' || LOWER(user_last_name)) ILIKE '%' || LOWER($2) || '%' 
            else true end
            ORDER BY user_id ASC
            offset $3 limit $4 
            ;`;
            const query = await fetch(searchUsers, false, userId, search, (page-1) * limit, limit);
            return res.status(200).json(query);
        }catch(error){
            return globalError(res, error);
        }
    },
    MEDIA: {
        GET: async function(req, res) {
            try{
                const {userId} = req.params;
                const user = await getUserFound(userId);
                if(!user) return res.status(404).json({message: "User not found", statusCode: 404})
                if(user.avatar){
                    const type = fs.existsSync(user.avatar);
                    if(type){
                        return res.sendFile(user.avatar);                        
                    }else return req.sendUserAvatar();
                }else return req.sendUserAvatar();
            }catch(error){
                return globalError(res, error);
            }
        }
    }
}