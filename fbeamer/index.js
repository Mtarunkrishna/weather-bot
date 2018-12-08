'use strict';
const crypto = require('crypto');
class FBeamer{
    constructor({pageAccessToken,verifyToken,appSecret}){
        try{
            if(pageAccessToken && verifyToken && appSecret){
                this.pageAccessToken=pageAccessToken;
                this.verifyToken=verifyToken;
                this.appSecret=appSecret;
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
    signatureVerifier(req,res,buf){
        //Returns a function that verifies signature.
        return (req,res,buf) =>{
            if(req.method==='POST'){
                try{
                    let signature=req.headers['x-hub-signature'];
                    if(!signature){
                        throw "Signature not received.";
                    }else{
                        let hash=crypto.createHmac('sha1',)
                    }
                }catch(e){
                    console.log(e);
                }
            }
        }
    }
}
module.exports=FBeamer;