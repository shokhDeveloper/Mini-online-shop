import os from "node:os";
let IP_ADDRESS = '';
try{
    const networkInterface = os.networkInterfaces();
    if(networkInterface["Беспроводная сеть 3"]){
        IP_ADDRESS += networkInterface["Беспроводная сеть 3"].find((network) => network.family == "IPv4").address;
    }
}catch(error){
    console.log("Network error:", error)
};   
export {IP_ADDRESS}