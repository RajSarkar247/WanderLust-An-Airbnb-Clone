const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Expresserror=require("../utils/Expresserror.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const listingcontroller=require("../controller/listings.js");
const multer=require('multer');
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});
//Schema Validation
const validatelisting=(req,res,next)=>{
    let {error,value}=listingSchema.validate(req.body,{abortEarly:false});
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserror(400,errMsg);
    }else{
        req.body.listing=value.listing;
        next();
    }
}
//Middleware
//Will check if the current user is the owner or not
const isOwner=async(req,res,next)=>{
    let {id}=req.params;  
    let listing=await Listing.findById(id);
    if(!(listing.owner._id.equals(res.locals.curruser._id))){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

console.log("Controller Check:", listingcontroller);
console.log("Show Function Check:", listingcontroller.showlisting);

router.route("/")
.get(wrapAsync(listingcontroller.index))  //index route
.post(upload.single('image'),validatelisting,wrapAsync(listingcontroller.createlisting)); //create route

//New Route
router.get("/new",listingcontroller.newlisting);

router.route("/:id")
.get(wrapAsync(listingcontroller.showlisting))//Show route
.put(isOwner,upload.single('image'),validatelisting,wrapAsync(listingcontroller.updatelisting))// update route
.delete(isOwner,wrapAsync(listingcontroller.deletelisting));//delete route

//Edit Route
router.get("/:id/edit",isOwner,wrapAsync(listingcontroller.editlisting));

module.exports=router;