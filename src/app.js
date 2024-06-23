import express from "express"
import cors from "cors"

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

import uploadRouter from "./routes/uploadCSV.route"

app.use("/api/v1", uploadRouter)

export default app