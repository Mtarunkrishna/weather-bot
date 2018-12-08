'use strict';

class FBeamer{
    constructor({pageAccessToken,verifyToken}){
        try{
            if(pageAccessToken && verifyToken){
                this.pageAccessToken=pageAccessToken;
                this.verifyToken=verifyToken;
            }else{
                throw "One or more tokens/credentials are missing.";
            }
        }catch(e){
            console.log(e);
        }
    }
    registerHook(req,res){
        const params=req.query;
        const mode=params['hub.mode'],
            token=params['hub.verify_token'],
            challenge=params['hub.challenge'];
        try{
            if((mode && token) && (mode === 'subscribe' && token===this.verifyToken)){
                console.log("Webhook registered.");
                return res.send(challenge);
            }else{
                console.log("Unable to register webhook.");
                return res.sendStatus(200);
            }
        }catch(e){
            console.log(e);
        }
    }
}
module.exports=FBeamer;