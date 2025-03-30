require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const MessageGenerator = require("./services/MessageGenerator");

const app = express();
app.use(
  cors({
    origin: "*", // Allow requests from any origin (you can restrict this later)
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// Routes
app.get("/api/messages", async (req, res) => {
  try {
    const message = await MessageGenerator.generateMessage();
    res.json(message);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate message" });
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
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to db & listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit the process on connection failure
  });

module.exports = app;
