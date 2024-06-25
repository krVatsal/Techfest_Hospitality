import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

const app = express()
app.use(cookieParser())
app.use(cors({
 origin: process.env.CORS_ORIGIN,
 Credential:true
}
))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Credentials', true);
        return res.status(200).json({});
    }
    next();
});

import uploadRouter from "./routes/uploadCSV.route.js"
import downloadRouter from "./routes/downloadCSV.route.js"

app.use("/api/v1", uploadRouter)
app.use("/api/v1", downloadRouter)

export default app