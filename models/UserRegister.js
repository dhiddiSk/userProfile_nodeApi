import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userRegisterSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    userName:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = UserRegister = mongoose.model("newUserReg", userRegisterSchema);

