import mongoose from "mongoose";

const Schema = mongoose.Schema;

// The below is the schema for the user registration

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

const UserReg = mongoose.model("newUserReg", userRegisterSchema);

export default UserReg;
