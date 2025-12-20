const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Expresserror=require("../utils/Expresserror.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const reviewcontroller=require("../controller/reviews.js");
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserror(400,errMsg);
    }else{
        next();
    }
}

const isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;  
    let review=await Review.findById(reviewId);
    if(!(review.author.equals(res.locals.curruser._id))){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Review Route
router.post("/",validateReview,wrapAsync(reviewcontroller.createreview))

//Delete Review Route
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewcontroller.deletereview))

module.exports=router;