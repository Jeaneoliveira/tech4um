import { Router } from "express";
import { identify } from "../controllers/authController";

const router = Router();

router.post("/identify", identify);

export default router;