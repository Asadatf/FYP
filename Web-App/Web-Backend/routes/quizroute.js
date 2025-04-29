import express from "express";
import { createquiz, generate_quiz, getAllquiz, getQuizById, validate_quiz } from "../controllers/quizcontroller.js";
const router = express.Router();

router.post('/addquiz', createquiz);
router.get('/getquizzes', getAllquiz);
router.get('/getquiz/:quizId', getQuizById);
router.post('/generate-quiz', generate_quiz);
router.post('/validatequiz', validate_quiz);









export default router;