import { Router } from "express";
import { uploadCSV } from "../controllers/uploads.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"

const router =Router()
router.route("/upload").post(
    upload.any([
        {
            name: "groupCSV",
            maxCount: "1"
        },
        {
            name: "hostelCSV",
            maxCount: "1"
        }

    ]),
    uploadCSV
)
export default router
