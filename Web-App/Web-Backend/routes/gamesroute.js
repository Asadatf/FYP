import express from "express";
import {
  createGame,
  deleteGameById,
  getAllGames,
} from "../controllers/gamescontroller.js";
const router = express.Router();

router.post("/addgame", createGame);
router.delete("/deletegame/:id", deleteGameById);
router.get("/getgames", getAllGames);

export default router;
