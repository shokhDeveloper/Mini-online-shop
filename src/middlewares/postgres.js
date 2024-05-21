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
export const getProducts = () => fetch("SELECT * FROM products;");
export const getCategories = () => fetch("SELECT * FROM categories;")