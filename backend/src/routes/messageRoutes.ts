import { Router } from "express";
import {
  createMessage,
  getMessagesByForum,
} from "../controllers/messageController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createMessage);
router.get("/:forumId", authMiddleware, getMessagesByForum);

export default router;