import { serverConfiguration } from "#config";
import { ClientError, globalError } from "#error";
import { tokenConfig } from "#jwt";
import { fetch, getUsers } from "#postgreSQL";

const replaceEmailToGmail = (email) => {
    let emailVal = email.includes("@e");
    let gmailVal = email.includes("@g")
    return emailVal ? email.replace("@e", "@g"): gmailVal ? emailVal.replace("@g", "@e"): false
}
export const model = (req, res, next) => {
    req.fetch = fetch;
    req.toCheckUser = async function(newUser, type){
        const condition = (user) => user.email == newUser.email || replaceEmailToGmail(newUser.email);
        try{
            const users = await getUsers();
            if(!users.some(condition) && type == "register") return true;
            if(users.some(condition) && type == "register") return false;
            if(users.some(condition) && type == "login") return {type: true, index: users.findIndex(condition), user: users.find(condition)};
            if(!users.some(condition) && type == "login") return false; 
        }catch(error){
            return globalError(res, error)
        }
    },
    req.insertUser = async function(newUser){
        try{
            const {user_first_name, user_last_name, email, password, confirm_password} = newUser;
            const avatar = req.avatarName;
            if(password === confirm_password){
                const insertUser = await req.fetch(`
                INSERT INTO users (user_first_name, user_last_name, email, password, confirm_password, avatar)
                VALUES($1, $2, $3, crypt($4, gen_salt('bf')), crypt($5, gen_salt('bf')), $6) 
                RETURNING 
                users.user_id, 
                user_first_name, 
                user_last_name, 
                email, 
                password 
                ;
                `, true, user_first_name, user_last_name, email, password, confirm_password, avatar);    
                if(insertUser.user_id){
                    if(req.files) req.files.avatar.mv(avatar)
                    return res.status(201).json({message: "The user successfull registreed !", user: insertUser, accessToken: tokenConfig.createToken({user_id: insertUser.user_id, client: true, userAgent: req.headers["user-agent"]}, process.env.TOKEN_KEY)});
                }
            } else throw new ClientError(400, "Password and confirm password values must be the same")
        }catch(error){
            return globalError(res, error)
        };
    };
    return next()
}