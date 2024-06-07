import { ClientError, ServerError, globalError } from "#error"
import { deleteShop, deleteShops, getProducts, getShopping, getShops, getUserFound, getUsers, insertShopping } from "#postgreSQL";

export const shopController = {
    GET: async function(req, res) {
        try{
            const {userId} = req.params;
            if(!req.user_id) throw new ClientError(404, "User is invalid or user not found !");
            if(!(userId == req.user_id)) throw new ClientError(401, "Your token does not respond to this request")
            const shops = await getShops(userId);
            return res.status(200).json(shops);
        }catch(error){
            return globalError(res, error);
        }
    },
    POST: async function(req, res) {
        try{
            const {productId} = req.params;
            const product = await getProducts(productId);
            if(!(product && product.length)) throw new ClientError(404, "Product is invalid or product not found !");
            if(!req.user_id) throw new ClientError(404, "User is invalid or user not found !");
            const user = await getUserFound(req.user_id);
            const insertShop = await insertShopping(user.user_id, product[0].product_id);
            const getShops = await getShopping(req.user_id);
            if(insertShop.shop_id) return res.status(201).json({message: "The product has been successfully purchased", statusCode: 201, shop: getShops[getShops.length-1]});
        }catch(error){
            return globalError(res, error);
        }
    },
    DELETE: async function(req, res) {
        try{
            const {shopId} = req.params;
            const deleteShopRes = await deleteShop(shopId);
            if(deleteShopRes && deleteShopRes.shop_id) return res.status(200).json({message: "Purchase successfully deleted !", statusCode: 200, shop: deleteShop})
            else throw new ServerError("The purchase could not be deleted !")
        }catch(error){
            return globalError(res, error);
        }
    }
}   