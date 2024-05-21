import path from "node:path";
import { ServerError, globalError } from "#error"
import { fetch, getProducts } from "#postgreSQL"
import { productValidator } from "#validator";

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
            if(productValidator.validate(newProduct).error instanceof Error){
                return res.status(400).json({message: productValidator.validate(newProduct).error.message, statusCode: 400})
            }
            if(productValidator.validate(newProduct)){
                let product_image = req.product_image;
                const pathname = path.join(process.cwd(), "uploads", product_image);
                const {product_image:{mv}} = req.files;
                const insertProduct = await fetch(`
                INSERT INTO products (product_name, product_price, category_id, product_image) 
                VALUES
                ($1, $2, $3, $4) RETURNING *;
                `, true, newProduct.product_name, newProduct.product_price, newProduct.category_id, pathname);
                if(insertProduct.product_id){
                    mv(pathname);
                    return res.status(201).json({message: "The product successfully created !", statusCode: 201, product: insertProduct});
                }else throw new ServerError("PostgreSQL failed to create product");
            }
        }catch(error){
            return globalError(res, error);
        }
    }
}