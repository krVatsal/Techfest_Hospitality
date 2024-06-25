import { Router } from "express";
import { downloadCSV } from "../controllers/uploads.controllers.js";

const router =Router()

router.route("/download").get(downloadCSV)

export default router