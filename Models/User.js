import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    userName:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true},
    isFemale:{type:Boolean, required:true}
    // imageSrc:{type:String, required:true}
});

const User = mongoose.model("User", userSchema); //השער לדאטה בייס
export default User;