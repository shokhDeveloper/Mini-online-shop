import jwt from "jsonwebtoken";
import { serverConfiguration } from "#config";
const {token_limit} = serverConfiguration;
const {sign, verify} = jwt
export const tokenConfig = {
    createToken(payload, KEY){
        try{
            if(!payload) throw new Error("Payload is not found !");
            if(!KEY) throw new Error("Key is not found !");
            let token = sign(payload, KEY, {expiresIn: token_limit});
            return token;
        }catch(error){
            console.log("Create token", error)
        }
    },
    parsedToken(token, KEY){
        try{
            if(!KEY) throw new Error("Key is not found !");
            return verify(token, KEY);
        }catch(error){
            console.log("Parsed token error", error);
        };
    }
};