import express from "express";
import {createGame, getAllGames} from '../controllers/gamescontroller.js'
const router = express.Router();

router.post('/addgame', createGame);
router.get('/getgames', getAllGames);









export default router;