const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userRegisterSchema = new schema({
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

module.exports = UserRegister = mongoose.model("modelSchema", userRegisterSchema);
