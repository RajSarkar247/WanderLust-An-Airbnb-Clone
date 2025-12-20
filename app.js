if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express=require("express"); 
const app=express(); 
const mongoose=require("mongoose"); 
mongoose.set("strictPopulate", false);
const port=8080;  
const dburl=process.env.ATLASDB_URL;

const path=require("path"); 
const methodOverride=require("method-override"); 
const ejsmate=require("ejs-mate");
const Expresserror=require("./utils/Expresserror.js");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"/views")); 
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride("_method")); 
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

//app.get("/",(req,res)=>{ 
   // res.send("Hi i am root"); 
//})
main().then(()=>{
     console.log("Connected to MongoDB"); 
    }).catch((err)=>{ 
        console.log(err); 
    })

async function main(){
    await mongoose.connect(dburl); 
}

app.listen(port,(req,res)=>{ 
    console.log("Server is listening"); 
}) 

const store=new MongoStore({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in Mongo Session store",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //It helps to store the information of the user for the particular session
passport.deserializeUser(User.deserializeUser()); //It removes the information of the user after the particular session is over

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

//Error Handling Middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    //res.status(statusCode).send(message);
    res.render("Error.ejs",{errormsg:message});
})

app.use((req, res) => {
  //res.status(404).send("Page Not Found");
  let msg="Page Not Found";
  res.render("Error.ejs",{errormsg:msg});
});


/*app.get("/testlisting",async(req,res)=>{
     let samplelisting=new listing({ title:"My Home", 
        description:"This is my beautiful home out for your convinemce at a very low price", 
        price:3000, 
        location:"Cayman Islands", 
        country:"Cayman Islands" }); 
     await samplelisting.save(); 
     console.log("Sample was saved"); 
     res.send("Succesfully saved");
});*/

