import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import useRouter from './Routers/useRouter.js';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import http from 'http';
import { Server } from "socket.io";
import { verifyToken } from './controllers/userController.js';
import {socketMW} from 'appSocketMW.js';
// import { memoryGame } from './memoryGame-socket.js';
const app = express();
const server=http.createServer(app);

export const io = new Server(server,{ cors:'*'  });
config();
const PORT = process.env.PORT || 8080;

//who can connect to me and if i can recieve data from the browser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/users',useRouter);

// socketMW()

//----------------------------------------------------------------

io.on("connection",(socket) => {
    console.log(`user connected in socket number ${socket.id}`);
    socket.on("sendMessage",(message,room)=> {
        const messageObject = {
            userObject: message.currentUserObject,
            messageId: Date.now(),
            timeSent: new Date(Date.now()).toLocaleTimeString('en-US',{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false}),
            content :message.userMsg
        }
        if(room){
            socket.to(room).emit("receivePrivateMessage",messageObject)
        }else
            io.emit("receiveMessage",messageObject)
            // socket.broadcast.emit("receiveMessage",messageObject)
    })
    socket.on('join-room',(room)=>{
        socket.join(room)
        console.log(`socket-- ${socket.id} added to room name -- ${room}`);
                                   
    })
    // socket.on('join-game',(gameName,chatId,currentUserObject)=>{
        // פה אדל שמה את הקוד שלה        

    // }


//----------------------------------------------------------------





mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}).catch(err => console.error(err));