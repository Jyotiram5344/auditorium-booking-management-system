// routes/emailRoutes.js
import express from "express";
import { getAllFaculties, sendEmail } from "../controllers/emailController.js";
const router = express.Router();

router.get("/faculties", getAllFaculties);

router.post("/sendEmail", sendEmail);

export default router;
