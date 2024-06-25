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

import uploadRouter from "./routes/uploadCSV.route.js"
import downloadRouter from "./routes/downloadCSV.route.js"

app.use("/api/v1", uploadRouter)
app.use("/api/v1", downloadRouter)

export default app