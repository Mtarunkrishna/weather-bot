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
    signatureVerifier(){
        //Returns a function that verifies signature.
        return (req, res, buf) => {
            if(req.method === 'POST') {
                try {
                    let signature = req.headers['x-hub-signature'];
                    if(!signature) {
                        throw "Signature not received";
                    } else {
                        let hash = crypto.createHmac('sha1', this.appSecret).update(buf, 'utf8');
                        if(hash.digest('hex') !== signature.split("=")[1]) {
                            throw "Invalid signature!";
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
    incoming(req,res,cb){
        res.sendStatus(200);
        if(req.body.object==='page' && req.body.entry){
            let data=req.body;
            data.entry.forEach(pageObj => {
                if(pageObj.messaging){
                    pageObj.messaging.forEach(messageObj =>{
                        if(messageObj.postback){
                            //handle postbacks
                        }else{
                            return cb(this.messageHandler(messageObj));
                        }
                    })
                }
            })
        }
    }
    messageHandler(obj){
        let sender=obj.sender.id;
        let message=obj.message;
        if(message.text){
            let obj = {
                sender,
                type: 'text',
                content: message.text
            };
            return obj;
        }
    }
}
module.exports=FBeamer;