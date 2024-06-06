import bcrypt from "bcrypt";
import path from "node:path";
import { ClientError, ServerError, globalError } from "#error";
import { getAdmins, getUserFound, updateAdminImage } from "#postgreSQL";
import { AdminValidator, LoginValidator, userValidator } from "#validator";
import { tokenConfig } from "#jwt";

export const authController = {
  AUTH: {
    CLIENT: {
        REGISTER: async function (req, res) {
          try {
            let newUser = req.body;
            if (!newUser) throw new ClientError(400, "User data is not available");
            if (userValidator.validate(newUser).error instanceof Error) {
              return res.status(400).json({
                message: userValidator.validate(newUser).error.message,
                statusCode: 400,
              });
            }
            if (userValidator.validate(newUser)) {
              const type = await req.toCheckUser(newUser, "register");
              if(type) return req.insertUser(newUser);
              if(!type) throw new ClientError(400, "The user has ben created !");
            }
          } catch (error) {
            return globalError(res, error);
          }
        },
        LOGIN: async function(req, res){
            try{
                const userValues = req.body;
                if(LoginValidator.validate(userValues).error instanceof Error){
                    throw new ClientError(400, LoginValidator.validate(userValues).error.message);
                };
                if(LoginValidator.validate(userValues)){
                    const {type, user} = await req.toCheckUser(userValues, "login");
                    if(type){
                        const myUser = await getUserFound(user.user_id);
                        const match = await bcrypt.compare(userValues.password, myUser.password);
                        delete user.confirm_password
                        delete user.avatar
                        if(match) return res.status(200).json({message: "The user successfully login", statusCode: 200, user: user, accessToken: tokenConfig.createToken({user_id: user.user_id, client: true, userAgent: req.headers["user-agent"]}, process.env.TOKEN_KEY)}); 
                        if(!match) throw new ClientError(400, "There is an error logging in");
                    }else throw new ClientError(400, "There is an error logging in");
                }
            }catch(error){
              console.log(error)
                return globalError(res, error);
            }
        }
    },
    ADMIN: {
        SIGN: async function(req, res){
            try{
                const adminValues = req.body;
                if(AdminValidator.validate(adminValues).error instanceof Error){
                  return res.status(400).json({message: AdminValidator.validate(adminValues).error.message, statusCode: 400});
                }
                if(AdminValidator.validate(adminValues)){
                  const getAdmin = await getAdmins();
                  console.log(adminValues, getAdmin)
                    if(getAdmin[0].admin_username == adminValues.admin_username){
                      if(adminValues.admin_password == adminValues.admin_confirm_password){
                            const match = await bcrypt.compare(adminValues.admin_password, getAdmin[0].admin_password);
                            if(match)  {
                              if(req.files){
                                const {admin_profile_image:{mv, name}} = req.files;
                                const adminImagePath = path.join(process.cwd(), "uploads", Date.now() + name.replaceAll(" ", ""));
                                const updateImage = await updateAdminImage(getAdmin[0].admin_id, adminImagePath);
                                if(updateImage.admin_id) {
                                  mv(adminImagePath);
                                  return res.status(200).json({message: "Admin profile picture successfully changed and successfully logged in", statusCode: 200, accessToken: tokenConfig.createToken({admin_id: getAdmin[0].admin_id, admin:true, userAgent: req["headers"]["user-agent"]}, process.env.TOKEN_KEY)});
                                }else throw new ServerError("There was an error updating the admin image !");
                              }else return res.status(200).json({message: "Admin successfully logged in", statusCode: 200, accessToken: tokenConfig.createToken({admin_id: getAdmin[0].admin_id, admin: true, userAgent: req.headers["user-agent"]}, process.env.TOKEN_KEY)})
                            } else throw new ClientError(400, "There is an error logging in");
                        }else throw new ClientError(400, "There is an error logging in")
                    }else throw new ClientError(400, "There is an error logging in");
                }
                return res.json()                
            }catch(error){
                console.log(error)
                return globalError(res, error);
            }
        }
    }
  }
};
