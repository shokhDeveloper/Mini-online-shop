export class ClientError extends Error {
    constructor(status, message){
        super()
        this.status = status;
        this.message = "ClientError:" + " " + message;
    }
}
export class ServerError extends Error {
    constructor(message){
        super()
        this.message = "ServerError:" + " " + message
    }
}
export const globalError = (res, error) => {
    return res.status(error.status || 500).json({message: error.message, statusCode: error.status || 500});
}