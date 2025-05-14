import express from "express";
import {
  saveGameScore,
  getGameScore,
} from "../controllers/gamesscorecontroller.js";
import { verifyToken } from "../controllers/verifyTokens.js";

const router = express.Router();

router.post("/score", verifyToken, saveGameScore);
router.get("/getScore/:game_id", verifyToken, getGameScore);

export default router;
