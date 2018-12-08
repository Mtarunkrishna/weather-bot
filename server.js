'use strict';

const express = require('express');

const server = express();
const PORT= process.env.PORT || 3000;

server.get('/',(req,res) => {
    res.send("hello");
   res.end();
});
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));