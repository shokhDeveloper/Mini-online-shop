import { globalError } from "#error"
import { getUsers } from "#postgreSQL";

export const userController = {
    GET: async function(req, res){
        try{
            return res.status(200).json(await getUsers());
        }catch(error){
            return globalError(res, error);
        }
    }
}