//modules
const express = require('express')
const app = express();
const path = require('path')
const server = require('http').createServer(app);
const io = require('socket.io')(server,{pingInterval: 5000});

const JoNetServer = require('./JoNetServer.js')
let joNetServer = new JoNetServer(io)

//config
const port = process.env.PORT || 80

//express routes
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"client","index.html"))
})

app.use('/client', express.static('client'))
app.use('/shared', express.static('shared'))

//host
server.listen(port,"0.0.0.0")
joNetServer.Start();
console.log(`listening on port ${port}`)