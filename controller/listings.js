const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({}); 
    res.render("index.ejs",{alllistings}); 
}

module.exports.newlisting=(req,res)=>{
    if(!(req.isAuthenticated())){
        req.flash("error","SignUp/Login first");
        return res.redirect("/login");
}else{
    res.render("new.ejs");
}
}

module.exports.showlisting=async(req,res)=>{
    let {id}=req.params; 
    const listing=await Listing.findById(id).populate("owner").populate({path:"reviews",populate:{path:"author"}}); 
    if(!listing){
        req.flash("error","Your Listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("show.ejs",{listing}); 
}

module.exports.createlisting=async(req,res)=>{
    if(!(req.isAuthenticated())){
        req.flash("error","SignUp/Login first");
        return res.redirect("/login");
    }else{
    let listing=req.body.listing; //Another way of getting the data from the body..Thereafter we add the new data in the database and redirect to the index route 
    const newlisting=new Listing(listing); 
    newlisting.owner=req.user._id;
    if(req.file){
      newlisting.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    }
    await newlisting.save(); 
    req.flash("success","New Listing Added Successfully");
    res.redirect("/listings"); 
    }
}

module.exports.editlisting=async(req,res)=>{
    if(!(req.isAuthenticated())){
        req.flash("error","SignUp/Login first");
        return res.redirect("/login");
    }else{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Your Listing does not exist");
        res.redirect("/listings");
    }
    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_300/w_250");
    res.render("edit.ejs",{listing,originalimageurl}); 
}
}

module.exports.updatelisting=async(req,res)=>{
    if(!(req.isAuthenticated())){
        req.flash("error","SignUp/Login first");
        return res.redirect("/login");
    }else{
    let {id}=req.params; 
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${id}`); 
    }
}

module.exports.deletelisting=async(req,res)=>{
    if(!(req.isAuthenticated())){
        req.flash("error","SignUp/Login first");
        return res.redirect("/login");
    }else{
    let {id}=req.params; 
    let deletedlisting=await Listing.findByIdAndDelete(id); 
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings"); 
    console.log(deletedlisting); 
    }
}