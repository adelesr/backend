import { config } from "dotenv";
import nodemailer from 'nodemailer';
import bodyParser from "body-parser";
config();
let verificationCodes = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD
    }})
export const sendCodeToMail= async(req,res)=>{
    const {email} = req.body;

    if(!email)
        return res.status(400).send("Email is required");

    if(!validateMailAddress(email))
        return res.status(400).send("Invalid email");

    const fourDigitCode = Math.floor(1000 + Math.random() * 9000);
    verificationCodes[email] = { code: fourDigitCode, expiresAt: Date.now() + 10 * 60 * 1000 };

    const mailOptions = {
        from:process.env.EMAIL_HOST,
        to: email,
        subject: 'PlayWithAs Verification Code:',
        text: `Your verification code is: ${fourDigitCode} `
    }
    const sendEmail = transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
            res.status(500).send("Error sending email");
        }
        else{
            console.log('Email sent: ', info.response);
            res.status(200).send("Verification code sent to your email");
        }
    })
}
export const checkVerifyCode = async (req,res) => {
    const {email, code} = req.body;
    const storedCode = verificationCodes[email];
 if(!storedCode)
        return res.status(400).send("Verification code not found");

    if(Date.now() > storedCode.expiresAt) //אם נמצאה כתובת מייל כזו בדיקשנרי אך תוקף השמירה של הקוד עבר- נמחק אותה
    {
        delete verificationCodes[email];
        return res.status(400).send("Verification code has expired");
    }
    if(code === storedCode.code) //אם תוקף הקוד עדיין נשמר במערכת 
    {
        delete verificationCodes[email];
        return res.status(200).send("Verification code is correct");
    }
    else res.status(400).send("Verification code is incorrect");
}