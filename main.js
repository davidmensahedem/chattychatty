import express from "express";
import {createServer} from "node:http";
import cors from "cors"
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

app.use(cors())

var messages = [];
var messagesCount = 0;

io.on("connection", (socket) => {

    console.log(socket.handshake.address)

   socket.on("setUserUp", data => {
        data.isOnline = true;
        // perform a database operation in here
        socket.emit("finishUserSetUp",data);

        // stage or level information
        // get stage from db 
        data.stage = 2;
        socket.emit("showUserStage",data);

       
   });

   socket.on("sendMessage", data => {

        // create a group using the Ids of the sender and receive
        // join them to that group
        // send only to that group

        // save message inside the db
        messages[messagesCount++] = data;

        //server actions
        socket.emit("updateNoty",messagesCount);
        socket.emit("getGroupMessages",messages);
   });

});

app.get("/", (req,res) => {
    res.send("Hello World");
});

server.listen(3111, () => {
    console.log("Server running at http://localhost:3111");
})