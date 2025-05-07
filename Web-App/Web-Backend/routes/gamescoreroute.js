import express from "express";
import { saveGameScore } from "../controllers/gamesscorecontroller.js";
import { verifyToken } from "../controllers/verifyTokens.js";

const router = express.Router();

router.post('/score', verifyToken, saveGameScore);








export default router;