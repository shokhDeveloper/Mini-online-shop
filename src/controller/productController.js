import fs from "node:fs";
import { ClientError, ServerError, globalError } from "#error"
import { fetch, getProducts, updateProduct } from "#postgreSQL"
import { productValidator, productValidatorFromProductImage } from "#validator";
import path from "node:path";
import { serverConfiguration } from "#config";

export const productController = {
    GET: async function(req, res){
        try{    
            const {productId} = req.params;
            const products = await getProducts(productId);
            return res.json(products);
        }catch(error){
            return globalError(res, error); 
        }
    },  
    POST: async function(req, res){
        try{
            const newProduct = req.body;
            if(req.files){
                if(productValidator.validate(newProduct).error instanceof Error){
                    return res.status(400).json({message: productValidator.validate(newProduct).error.message, statusCode: 400})
                }
                if(productValidator.validate(newProduct)){
                    let product_image = req.product_image;
                    return req.insertProduct(product_image)
                };
            } throw new ClientError(400, "Product image is requried !");
        }catch(error){
            return globalError(res, error);
        }
    },
    PUT: async function(req, res){
        try{
            const {productId} = req.params;
            const updateProductValues = req.body;
            const files = req.files;
            const product = await fetch("SELECT * FROM products WHERE product_id=$1;", true, productId);
            if(productValidator.validate(updateProductValues).error instanceof Error) throw new ClientError(400, productValidator.validate(updateProductValues).error.message);  
            if(files){
                const oldProductImage = product.product_image;
                const exists = fs.existsSync(oldProductImage);
                if(exists) {
                    const newProductImagePath = path.join(process.cwd(), "uploads", req.product_image)
                    const updateProductRes = await updateProduct(productId, updateProductValues.product_name, updateProductValues.product_price ? +updateProductValues.product_price : 0, updateProductValues.category_id ? +updateProductValues.category_id: 0, newProductImagePath);
                    console.log(updateProductRes)
                    if(updateProductRes.product_id) {
                        serverConfiguration.userSetDefaultImage(oldProductImage);
                        files.product_image.mv(newProductImagePath);
                        return res.status(200).json({message: "Product successfully updated", product: updateProductRes, statusCode: 200})
                    }
                }else throw new ServerError("Old product image is not found !");
            };
            const updateProductRes = await updateProduct(productId, updateProductValues.product_name, updateProductValues.product_price ? +updateProductValues.product_price : 0, updateProductValues.category_id ? +updateProductValues.category_id: 0, updateProductValues.product_image);
            if(updateProductRes.product_id) return res.status(200).json({message: "Product successfully updated", product: updateProductRes, statusCode: 200})
        }catch(error){
            console.log(error);
            return globalError(res, error)
        }
    },
    DELETE: async function(req, res){
        try{
            const {productId} = req.params;
            const product = await fetch(`SELECT * FROM products WHERE product_id=$1`, true, productId);
             if(!product.product_id) throw new ClientError(404, "Product is not found");
            const deleteProduct = await fetch(`DELETE from products WHERE product_id=$1 RETURNING *`, true, productId);
            if(deleteProduct.product_id) {
                fs.unlinkSync(deleteProduct.product_image);
                return res.status(200).json({message: "The product successfully deleted !", product: deleteProduct, statusCode: 200}) 
            } 
        }catch(error){
            return globalError(res, error);
        }
    },
    MEDIA:{
        GET: async function(req, res){
            try{
                const {productId} = req.params;
                const product = await fetch(`SELECT * FROM products WHERE product_id=$1`, true, productId);
                if(product.product_id){
                    const type = fs.existsSync(product.product_image);
                    if(type) {
                        return res.sendFile(product.product_image);
                    }else throw new ServerError("Product image is not found");
                }   
            }catch(error){
                return globalError(res, error);
            }    
        }
    }
}