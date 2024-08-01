const mongoose =require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const DBConnection = async()=>{
    const MONGODB_URI=process.env.MONGODB_URI;
    try{
        await mongoose.connect(MONGODB_URI);
        console.log("Connected");
    }catch(error){
        console.log("Error");
    }
};

module.exports = {DBConnection};