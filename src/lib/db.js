import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected");
    }catch(error){
        console.log("Error connecting database");
        process.exit(1);
    }
}