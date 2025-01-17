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
import {socketMW} from './appSocketExt.js';
// import { memoryGame } from './memoryGame-socket.js';
const app = express();
const server=http.createServer(app);

export const io = new Server(server,{ cors:'*'  });
config();
const PORT = process.env.PORT || 8080;

//who can connect to me and if i can recieve data from the browser
app.use(cors({origin: 'http://localhost:5173',credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/users',useRouter);

socketMW()

//----------------------------------------------------------------


//----------------------------------------------------------------





mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}).catch(err => console.error(err));