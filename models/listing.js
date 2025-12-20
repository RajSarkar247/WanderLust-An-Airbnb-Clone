const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,},
    description:{
        type:String,
        required:true},
    image:{
        url:String,
        filename:String,
    },
        //set:(v)=> v===""?"https://images.unsplash.com/photo-1744619438376-30bfc6c4666c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,},
    price:Number,
    location:{
        type:String,
        required:true},
    country:{
        type:String,
        required:true},
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],    
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
