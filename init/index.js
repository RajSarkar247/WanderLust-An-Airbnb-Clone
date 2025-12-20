const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initdb=async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'69048d1ac2112da39989f582'}));
    await listing.insertMany(initdata.data);
    console.log("Database Initialised");
    mongoose.connection.close();
}

initdb();