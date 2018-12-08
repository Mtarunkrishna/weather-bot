'use strict';

const express = require('express');
const bodyParser= require('body-parser');
const config=require('./config');
const server = express();
const PORT= process.env.PORT || 3000;
const FBeamer=require('./fbeamer');

const f=new FBeamer(config.fb);
server.get('/',(req,res) => f.registerHook(req,res));
server.post('/', bodyParser.json({
    verify: f.signatureVerifier,
}));
server.post('/',(req,res,next)=>{
    return f.incoming(req,res,async data=>{
        try{
            if(data.content==='hi there'){
                await f.txt(data.sender,"Hey from Vanilla!");
                await f.img(data.sender,"https://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg");
            }
        }catch(e){
            console.log(e);
        }
    });
});
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));