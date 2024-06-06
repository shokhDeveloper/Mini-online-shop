import pkg from "pg";
const {Pool} = pkg;
export const pool = new Pool({
    database: "magazin",
    port: 5432,
    host: "localhost",
    user: "postgres",
    password: "82850406m"
});

export const fetch = async (query, type, ...params) => {
    const client = await pool.connect();
    try{
        if(type){
            const {rows:[row]} = await client.query(query, params.length ? params: null);
            return row;
        }else{
            const {rows} = await client.query(query, params ? params: null);
            return rows
        };
    }catch(error){
        console.log(error)
    }finally{
        await client.release()
    }
}
export const getUsers = () => fetch("SELECT * FROM users;") 
export const getUserFound = (id) => fetch("SELECT * FROM users WHERE user_id=$1", true, id); 
export const getAdmins = () => fetch("SELECT * FROM admins");
export const getProducts = (productId) => fetch(`SELECT p.product_id, p.product_name, p.product_price, c.category_name as category_id FROM products p
INNER JOIN categories c ON c.category_id=p.category_id
WHERE CASE WHEN $1 > 0 THEN product_id=$1 ELSE true end;`, false, productId);
export const getCategories = () => fetch("SELECT * FROM categories;");
export const insertProduct = (...values) => fetch(`
INSERT INTO products (product_name, product_price, category_id, product_image)
VALUES ($1, $2, $3, $4)
RETURNING product_name, product_price, product_id, created_at;`, true, ...values);
export const updateProduct = (productId ,...values) => fetch(`
UPDATE products SET 
    product_name = CASE WHEN length($2) > 0 THEN $2 ELSE product_name END, 
    product_price = CASE WHEN $3 > 0 THEN $3 ELSE product_price END, 
    category_id = CASE WHEN $4 > 0 THEN $4 ELSE category_id END,
    product_image = CASE WHEN length($5) > 0 THEN $5 ELSE product_image END
WHERE product_id = $1 
RETURNING product_name, product_price, category_id, product_id;
`, true, productId, ...values);
export const updateAdmin = (adminId, ...adminValues) => fetch(`UPDATE admins SET 
admin_username=CASE WHEN length($2) > 0 THEN $2 ELSE admin_username END,
admin_password=CASE WHEN length($3) > 0 THEN crypt($3, gen_salt('bf')) ELSE admin_password END,
admin_confirm_password=CASE WHEN length($4) > 0 THEN crypt($4, gen_salt('bf')) ELSE admin_confirm_password END,
admin_profile_image = CASE WHEN length($5) > 0 THEN $5 ELSE admin_profile_image END
WHERE admin_id=$1
returning *`, true, adminId, ...adminValues);
export const getShops = (userId) => fetch(`SELECT sh.shop_id, CONCAT(u.user_first_name || ' ' || u.user_last_name) as username, p.product_id, p.product_name,  p.product_price as price, c.category_name as category FROM shops sh
INNER JOIN products p ON p.product_id=sh.shop_product_id
INNER JOIN users u ON sh.shop_user_id=u.user_id
INNER JOIN categories c ON c.category_id=p.category_id
WHERE CASE WHEN $1 > 0 THEN shop_user_id=$1 
ELSE true END;`, false, userId);
export const insertShopping = (userId, productId) => fetch(`INSERT INTO shops (shop_user_id, shop_product_id) VALUES ($1, $2) RETURNING *`, true, userId, productId);
export const getShopping = (userId) => fetch(`SELECT sh.shop_id, CONCAT(u.user_first_name || ' ' || u.user_last_name) as username, p.product_name as product, p.product_price as price, sh.payment, c.category_name as category
FROM users u 
INNER JOIN shops sh ON u.user_id=sh.shop_user_id 
INNER JOIN products p ON p.product_id=sh.shop_product_id  
INNER JOIN categories c ON p.category_id=c.category_id
WHERE u.user_id=$1;`, false, userId);
export const updateUser = (userId, ...values) => fetch(`UPDATE users SET
user_first_name=CASE WHEN length($2) > 0 THEN $2 ELSE user_first_name END ,
user_last_name=CASE WHEN length($3) > 0 THEN $3 ELSE user_last_name END,
email=CASE WHEN length($4) > 0 THEN $4 ELSE email END,
password=CASE WHEN length($5) > 0 THEN crypt($5, gen_salt('bf')) ELSE password END,
confirm_password=CASE WHEN length($6) > 0 THEN crypt($6, gen_salt('bf')) ELSE confirm_password END,
avatar=CASE WHEN length($7) > 0 THEN $7 ELSE avatar END
WHERE user_id=$1
RETURNING user_first_name, user_last_name, email, password `, true, userId, ...values);
export const deleteUser = (userId) => fetch(`DELETE from users WHERE user_id=$1 RETURNING *;`, true, userId);
export const deleteShops = (userId) => fetch(`DELETE from shops WHERE shop_user_id=$1 RETURNING *;`, true, userId);
export const updateAdminImage = (adminId, admin_profile_image) => fetch(`UPDATE admins SET admin_profile_image=$2 WHERE admin_id=$1 RETURNING *;`, true, adminId, admin_profile_image);
export const deleteShop = (shopId) => fetch(`DELETE from shops WHERE shop_id=$1 RETURNING *;`, true, shopId); 