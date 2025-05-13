import express from "express";
import { saveGameScore } from "../controllers/gamesscorecontroller.js";

const router = express.Router();

router.post('/score', saveGameScore);








export default router;