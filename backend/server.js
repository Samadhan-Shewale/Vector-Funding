import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express()
dotenv.config();

const PORT=process.env.PORT || 5000
const MONGODB_URI=process.env.MONGODB_URI 
app.use(cors({
    origin :'http://localhost:5173',
    credientials : true
}))

main()
    .then(()=> console.log("Connected to mongoDB local"))
    .catch((err)=> console.log("MongoDB connection error: ",err ))

app.get("/api/test",(req,res )=>{
    console.log("App working its console");
    res.send("Its working..");
})



async function main(){
    if(MONGODB_URI){
        await mongoose.connect(MONGODB_URI )
    }else{
        console.log("MONGODB_URI not found in environment variables...")
    }
}

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})