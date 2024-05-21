import { globalError } from "#error"
import { getProducts } from "#postgreSQL"

export const productController = {
    GET: async function(req, res){
        try{    
            const products = await getProducts();
            return res.json(products);
        }catch(error){
            return globalError(res, error);
        }
    },
    POST: async function(req, res){
        try{
            const newProduct = req.body;
            
        }catch(error){
            return globalError(res, error);
        }
    }
}