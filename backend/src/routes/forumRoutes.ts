import { Router } from "express";
import { createForum, getForums } from "../controllers/forumController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getForums);
router.post("/", authMiddleware, createForum);

export default router;