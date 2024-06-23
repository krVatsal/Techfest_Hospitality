import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

const connectDB= async()=>{
    try {
        // await mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
        await mongoose.connect("mongodb://localhost:27017/Hospitality")
        console.log("Server connected to Database successfully")
    } catch (error) {
        console.log("Failed to connexct to db")
     return res
     .status(400)
     .json(400, "Failed to connect to db")
      process.exit(1)
    }
}
export default connectDB