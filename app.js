import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import useRouter from './Routers/useRouter.js';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
const app = express();
config()
const PORT = process.env.PORT || 8080;
//who can connect to me and if i can recieve data from the browser
app.use(cors({origin: 'http://localhost:5173',credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/v1/users',useRouter);


mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}).catch(err => console.error(err));