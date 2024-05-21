import { globalError } from "#error"
import { getCategories } from "#postgreSQL";

export const categoryController = {
    GET: async function(req, res){
        try{
            const categories = await getCategories();
            return res.status(200).json(categories)
        }catch(error){
            return globalError(res, error);
        }
    }
}