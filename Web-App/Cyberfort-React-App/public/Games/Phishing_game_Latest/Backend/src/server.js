require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// Python service URL - change this if hosted differently
const PYTHON_SERVICE_URL = "http://localhost:5001";

// Import MessageGenerator for fallback
const MessageGenerator = require("./services/MessageGenerator");

// Routes
app.get("/api/messages", async (req, res) => {
  try {
    // Try to connect to the Python service with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

    const response = await fetch(`${PYTHON_SERVICE_URL}/api/messages`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Python service returned status: ${response.status}`);
    }

    const message = await response.json();
    console.log("Generated message via model service");
    res.json(message);
  } catch (error) {
    console.error("Error connecting to Python service:", error.message);
    // Fallback to local message generation
    const message = await MessageGenerator.getRandomPredefinedMessage();
    console.log("Generated message via local fallback");
    res.json(message);
  }
});

// MongoDB Schema
const ScoreSchema = new mongoose.Schema({
  score: Number,
  playerName: String,
  date: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", ScoreSchema);

// Route to save score
app.post("/api/scores", async (req, res) => {
  try {
    const { score, playerName } = req.body;
    const newScore = new Score({ score, playerName });
    await newScore.save();
    res.json(newScore);
  } catch (error) {
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Route to get high scores
app.get("/api/scores/top", async (req, res) => {
  try {
    const topScores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(topScores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster1.wg1c3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to db & listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Database connection failed: ${error.message}`);
    process.exit(1);
  });
