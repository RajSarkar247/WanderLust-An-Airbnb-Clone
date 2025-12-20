const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const usercontroller=require("../controller/user.js");
/*const savedUrl=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl; 
    }
}
    next();
}*/

router.get("/signup",usercontroller.rendersignup);

router.post("/signup",wrapAsync(usercontroller.signup));

router.get("/login",usercontroller.renderlogin);

//passport.authenticate directly authenticates the login data and thereby lets login or redirects again to login page as per the code
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(usercontroller.login));

router.get("/logout",usercontroller.logout);

module.exports=router;