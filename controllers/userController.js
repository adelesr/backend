
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from "../Models/User.js";
import { isPasswordCorrect, validateMailAddress } from "./validatorController.js";
import { saveUserId } from "../Models/Number.js";


export const signUp = async (req,res) => {
    try{
        const {userName,password,email,isFemale} = req.body;
        console.log(req.body);
        if (!userName||!password||!email)
        {
            return res.status(400).send("Username, password and phone number are required");
        }
        const user = await User.findOne({userName});
        console.log(user);
        if(user) 
        {
            return res.status(400).send("User is already exists,go to log in page");
        }
        else {
            if (!isPasswordCorrect(password)) 
            {
                console.log("Password is not correct");

                return res.status(400).send("Password must be at least 8 characters long, contain at least one letter, one special character, and at least one number");
            }

            if( !validateMailAddress(email) )
            {
                console.log("email is not correct");
                return res.status(400).send("Invalid email please try again! \n notice that email must be in format of  example@example.com");
            }   
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            await User.create({userName:userName, password: hashedPassword,email: email,isFemale: isFemale});
            res.status(201).send("User created successfully");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("error");
    }
}
export const LogIn = async (req,res) => {
    try {
        const { userName, password } = req.body;
        console.log(password);
        if (!userName ||!password)
        {
             return res.status(400).send("Username and password are required");
        }
           
        if (!isPasswordCorrect(password))
        {
            console.log("Password is not correct");
            return res.status(400).send("Password must be at least 8 characters long, contain at least one letter, at least one number, and one special character");
        }
        console.log("blala")
        const user = await User.findOne({ userName });
        if (!user) {
            console.log("User not found");
            return res.status(404).send( "The user was not found");
        }
        else{
            console.log("User found");
            const samePassword = await bcrypt.compare(password, user.password);
            console.log(samePassword);
            if(!samePassword) 
                res.status(404).send("The password or the user name are not correct, please sign in or try again");
    
            const token= jwt.sign({userName: userName}, process.env.SECRET_KEY, { expiresIn: '24h',issuer: 'http://localhost:8080'});
            res.cookie('jwt', token, {httpOnly: true, maxAge: 90000}).send("Logged in successfully");
            res.json(user);
        }
    }catch(err) {
        console.log(err);
        res.status(500).send("error");
    }
}

export const verifyToken = (req,res) => {
    const token = req.cookies.jwt; //שליפה של הטוקן ממאגר הקוקיז
    if(!token) 
        return res.status(401).send('Access denied');

    const isVerify=jwt.verify(token, process.env.JWT_SECRET,{issuer: 'http://localhost:8080'})
        if(!isVerify) 
            return res.status(403).send('Access denied');
        res.send();
    }

