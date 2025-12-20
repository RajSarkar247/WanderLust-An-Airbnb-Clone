const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportlocalmongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportlocalmongoose); // Automatically adds a username and password with hashing and salting
module.exports=mongoose.model("User",userSchema);