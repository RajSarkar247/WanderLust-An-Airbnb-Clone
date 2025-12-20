const User=require("../models/user");
const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.rendersignup=(req,res)=>{
    console.log("Signup route trigerred");
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{   //This req.login helps automatic login after signup.
        if(err){
            return next(err);
        }else{
          req.flash("success","User Registered Successfully");
          res.redirect("/listings");
        }
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderlogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listings");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","Logged Out Successfully");
            res.redirect("/listings");
        }
    })
}