'use strict';
const crypto = require('crypto');
const request=require('request');
const apiVersion='v2.6';
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
    sendMessage(payload){
        return new Promise((resolve,reject)=>{
          request({
              url:`https://graph.facebook.com/${apiVersion}/me/messages`,
              qs:{
                  access_token:this.pageAccessToken
              },
              method:"POST",
              json:payload
          },(error,response,body)=>{
                if(!error && response.statusCode === 200){
                    resolve({
                       mid: body.message_id
                    });
                }else{
                    reject(error);
                }
          })
        })
    }
    txt(id,text,messaging_type='RESPONSE'){
        let obj={
            messaging_type,
            recipient:{
                id
            },
            message:{
                text
            }
        };
        return this.sendMessage(obj);
    }
    img(id,url,messaging_type='RESPONSE'){
        let obj={
          messaging_type,
          recipient: {
              id
          },
            message: {
              attachment:{
                  type: 'image',
                  payload:{
                      url
                  }
              }
            }
        };
        return this.sendMessage(obj);
    }
}
module.exports=FBeamer;