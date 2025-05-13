import db from "../index.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "your_free_api_key_here"
);

export const createquiz = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      questions,
      timeEstimate,
      completion,
    } = req.body;

    // Validate required fields
    if (!title || !difficulty || questions === undefined || !timeEstimate) {
      return res.status(400).json({
        error:
          "Missing required fields. Title, difficulty, questions, and time estimate are required.",
      });
    }

    // Insert into quizzes table
    const result = await db.query(
      "INSERT INTO quizzes (title, description, difficulty, questions, time_estimate, completion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [
        title,
        description || "",
        difficulty,
        questions,
        timeEstimate,
        completion || 0,
      ]
    );

    const quizId = result.rows[0].id;

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: {
        id: quizId,
        title,
        description: description || "",
        difficulty,
        questions,
        timeEstimate,
        completion: completion || 0,
      },
    });
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ error: "Quiz creation failed" });
  }
};

export const getAllquiz = async (req, res) => {
  try {
    const { is_active } = req.query;

    // Base query
    let query = "SELECT * FROM quizzes";
    const queryParams = [];

    // Filter by is_active if provided
    if (is_active !== undefined) {
      query += " WHERE is_active = $1";
      queryParams.push(is_active === "true" || is_active === "1");
    }

    // Execute query with async/await
    const result = await db.query(query, queryParams);

    res.status(200).json({
      count: result.rows.length,
      quizzes: result.rows,
    });
  } catch (error) {
    console.error("Get quizzes error:", error);
    res.status(500).json({ error: "Failed to retrieve quizzes" });
  }
};

///Get one quiz
export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Validate quizId
    if (!quizId || isNaN(quizId)) {
      return res.status(400).json({ error: "Invalid quiz ID" });
    }

    // Query to get a single quiz
    const query = "SELECT * FROM quizzes WHERE id = $1";
    const result = await db.query(query, [quizId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({
      quiz: result.rows[0],
    });
  } catch (error) {
    console.error("Get quiz by ID error:", error);
    res.status(500).json({ error: "Failed to retrieve quiz" });
  }
};

export const generate_quiz = async (req, res) => {
  try {
    const { topic, difficulty, numberOfQuestions } = req.body;

    // Make sure we have a valid model name - "gemini-1.0-pro" or "gemini-1.5-pro" for newer version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a quiz about ${topic} at ${difficulty} level with ${numberOfQuestions} multiple choice questions.Give new questions not the previous ones.
Each question should have 4 options with only 1 correct answer.
Return ONLY valid JSON with this exact structure, no other text:
{
  "title": "Quiz title",
  "description": "Quiz description",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "explanation": "Explanation for the correct answer"
    }
  ]
}`;

    // Generate content using the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let quizData;
    try {
      // Try to parse the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (parseError) {
      console.log("Error parsing the response from Gemini:", parseError);
      console.log("Raw response:", text);

      // Create a simple fallback quiz
      quizData = {
        title: `${topic} Quiz`,
        description: `A ${difficulty} level quiz about ${topic}`,
        questions: Array.from({ length: numberOfQuestions }, (_, i) => ({
          question: `Question ${i + 1} about ${topic}?`,
          options: [
            `Answer A for question ${i + 1}`,
            `Answer B for question ${i + 1}`,
            `Answer C for question ${i + 1}`,
            `Answer D for question ${i + 1}`,
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `This is the explanation for question ${
            i + 1
          } about ${topic}.`,
        })),
      };
    }

    // Add metadata to the quiz
    const quiz = {
      ...quizData,
      difficulty,
      time_estimate: numberOfQuestions * 2,
      passing_score: 70,
      total_questions: numberOfQuestions,
    };

    res.json({ quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);

    // Create a simple fallback quiz
    const fallbackQuiz = {
      title: `${req.body.topic} Quiz`,
      description: `A ${req.body.difficulty} level quiz about ${req.body.topic}`,
      questions: Array.from({ length: req.body.numberOfQuestions }, (_, i) => ({
        question: `Question ${i + 1} about ${req.body.topic}?`,
        options: [
          `Answer A for question ${i + 1}`,
          `Answer B for question ${i + 1}`,
          `Answer C for question ${i + 1}`,
          `Answer D for question ${i + 1}`,
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This is the explanation for question ${i + 1} about ${
          req.body.topic
        }.`,
      })),
      difficulty: req.body.difficulty,
      time_estimate: req.body.numberOfQuestions * 2,
      passing_score: 70,
      total_questions: req.body.numberOfQuestions,
    };

    res.json({
      quiz: fallbackQuiz,
      error: error.message,
    });
  }
};

// Validate quiz answers
export const validate_quiz = async (req, res) => {
  try {
    const { quizData, userAnswers } = req.body;

    // Check if required data is present
    if (!quizData || !userAnswers) {
      return res
        .status(400)
        .json({ error: "Quiz data and user answers are required" });
    }

    // Check if questions array exists
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return res.status(400).json({ error: "Invalid quiz format" });
    }

    let correctAnswers = 0;

    // Validate each answer
    const answers = quizData.questions.map((question, index) => {
      // Convert index to string if needed for object key comparison
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionIndex: index,
        correct: isCorrect,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
      };
    });

    // Calculate percentage
    const totalQuestions = quizData.questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Determine if passed based on quiz passing score
    const passingScore = quizData.passing_score || 70;
    const passed = percentage >= passingScore;

    // Determine grade
    let grade;
    if (percentage >= 90) grade = "Excellent";
    else if (percentage >= 80) grade = "Very Good";
    else if (percentage >= 70) grade = "Good";
    else if (percentage >= 60) grade = "Satisfactory";
    else grade = "Needs Improvement";

    // Return validation results
    res.json({
      totalQuestions,
      correctAnswers,
      percentage,
      passed,
      grade,
      answers,
    });
  } catch (error) {
    console.error("Error validating quiz:", error);
    res.status(500).json({ error: "Failed to validate quiz" });
  }
};

export const saveQuiz = (req, res) => {
  try {
    // Extract parameters from request
    const quizId = req.query.quizId;
    const userId = req.query.userId;
    const score = req.body.score;
    const passed = req.body.passed || false;

    // SQL query to insert quiz attempt
    const query = `
      INSERT INTO QUIZ_ATTEMPTS (
        user_id, 
        quiz_id,
        score, 
        passed
      ) 
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    // Parameters for the query
    const values = [userId, quizId, score, passed];

    // Execute query
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error saving quiz attempt:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to save quiz attempt",
          error: err.message,
        });
      }

      // Return success response with saved data
      return res.status(201).json({
        success: true,
        message: "Quiz attempt saved successfully",
        data: result.rows[0],
      });
    });
  } catch (error) {
    console.error("Error in saveQuiz function:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
