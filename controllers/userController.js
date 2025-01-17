
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from "../Models/User.js";
import { isPasswordCorrect, validateMailAddress } from "./validatorController.js";



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

            if(!validateMailAddress(email))
            {
                console.log("email is not correct");
                return res.status(400).send("Invalid email please try again! \n notice that email must be in format of  example@example.com");
            }   
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            await User.create({userName:userName, password: hashedPassword,email: email,isFemale: isFemale});
            res.status(200).send("signed up successfully, go to login page");
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
            return res.status(404).send( "The user was not found, please try again or go to sign up page");
        }
        else{
            console.log("User found");
            const samePassword = await bcrypt.compare(password, user.password);
            console.log(samePassword);
            if(!samePassword) 
            {
                return res.status(404).send("The password or the user name are not correct, please sign in or try again");
            }
    
            const token= jwt.sign({userName: userName}, process.env.SECRET_KEY, { expiresIn: '24h',issuer: 'http://localhost:8080'});
            res.cookie('jwt', token, {httpOnly: true, maxAge: 90000});
            return res.send(user);
        }
    }catch(err) {
        console.log(err);
       return res.status(500).send("error");
    }
    // const { userName, password } = req.body;
    // const user ={userName, password};
    // const token= jwt.sign({userName: userName}, process.env.SECRET_KEY, { expiresIn: '24h',issuer: 'http://localhost:8080'});
    // res.cookie('jwt', token, {httpOnly: true, maxAge: 90000});
    // return res.send(user);

}

export const verifyToken = async(req,res,next) => {
    const token = req.cookies.jwt; //שליפה של הטוקן ממאגר הקוקיז
    if(!token) 
        return res.json({message: 'Invalid token', status: false});
    try{
        const isVerify=jwt.verify(token, process.env.JWT_SECRET,{issuer: 'http://localhost:8080'})
        if(!isVerify) 
            return res.status(403).json({message: 'Invalid token', status: false});

        next();
    }
    catch(err){
        console.log(err);
        return res.send({message: 'Invalid token', status: false});
    }
}
    

