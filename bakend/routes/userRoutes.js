// routes/userRoutes.js
import express from "express";
import { listUsers, deleteUser, updateUser } from "../controllers/userController.js";
const router = express.Router();

router.get("/", listUsers);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;
