
import nodemailer from 'nodemailer';
import bodyParser from "body-parser";
import { validateMailAddress } from "./validatorController.js";
import dotenv from 'dotenv';
import User from "../Models/User.js";
dotenv.config();
let verificationCodes = {email:'',code:''};

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD
    }})
export const sendCodeToMail= async(req,res)=>{
    const {email} = req.body;
    console.log("email:",email);
    if(!email)
    {
        console.log("No email provided");
        return res.status(400).send("Email is required");
    }

    if(!validateMailAddress(email))
        return res.status(400).send("Invalid email, notice that email must be in format of  example@example.com");

    const fimdUserByMail = await User.findOne({email});
    if(!fimdUserByMail)
        return res.status(400).send("User with this email does not exist, please sign up first");

    const fourDigitCode = Math.floor(1000 + Math.random() * 9000);
    verificationCodes[email] = { code: fourDigitCode, expiresAt: Date.now() + 10 * 60 * 1000 };
    console.log("the verificationCodes[email]",verificationCodes[email]);
    const mailOptions = {
        from:process.env.EMAIL_HOST,
        to: email,
        subject: 'PlayWithAs Verification Code:',
        text: `Your verification code is: ${fourDigitCode}`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
          res.status(200).send("Verification code sent to your email");
        }
      });
}
export const checkVerifyCode = async (req,res) => {
    const {email, code} = req.body;
    console.log(email,'code:'+code);

    if(code== null || code === ''  || code.length !=4 || isNaN(code)  || code.toString().indexOf('.') > -1)
    {
        console.log("No verification code provided, its null");
        return res.status(400).send("Please enter the verification code you received,\n"
             +"noticed that it must be 4 digits long and should not contain any special characters");
    }

    const storedCode = verificationCodes[email];
    console.log(storedCode);
    if(!storedCode)
    {
        console.log("No verification code found for the given email");
        return res.status(400).send("Verification code not found, please send the correct email or go to sign up page");
    }
    console.log("storedCode.code:",storedCode.code);
    if(Date.now() > storedCode.expiresAt) //אם נמצאה כתובת מייל כזו בדיקשנרי אך תוקף השמירה של הקוד עבר- נמחק אותה
    {
        delete verificationCodes[email];
        return res.status(400).send("Verification code has expired, please try again");
    }
    if(code == storedCode.code) //אם תוקף הקוד עדיין נשמר במערכת 
    {
        delete verificationCodes[email];
        return res.status(200).send("Verification code is correct");
    }
     res.status(400).send("Verification code is incorrect, please try again or resend the verification code");
}