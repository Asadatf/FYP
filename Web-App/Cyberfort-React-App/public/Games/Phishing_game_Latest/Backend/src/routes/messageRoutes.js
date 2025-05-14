const express = require("express");
const router = express.Router();
const MessageGenerator = require("../services/MessageGenerator");

// Initialize the message generator
const messageGenerator = new EnhancedMessageGenerator();

// Get a randomly generated message
router.get("/", async (req, res) => {
  try {
    const message = await messageGenerator.generateMessage();
    res.json(message);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate message" });
  }
});

// Get a specific type of message
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const isPhishing = req.query.phishing === "true";

    // Validate type parameter
    if (!["email", "sms", "socialMedia"].includes(type)) {
      return res.status(400).json({
        error: "Invalid message type. Must be email, sms, or socialMedia",
      });
    }

    const message = await messageGenerator.generateCreativeMessage(
      type,
      isPhishing
    );
    res.json(message);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate message" });
  }
});

// Generate a batch of messages
router.post("/batch", async (req, res) => {
  try {
    const { count = 5, types = ["email", "sms", "socialMedia"] } = req.body;

    // Validate input
    if (count < 1 || count > 20) {
      return res.status(400).json({ error: "Count must be between 1 and 20" });
    }

    if (
      !Array.isArray(types) ||
      !types.every((type) => ["email", "sms", "socialMedia"].includes(type))
    ) {
      return res.status(400).json({
        error:
          "Types must be an array containing email, sms, and/or socialMedia",
      });
    }

    // Generate multiple messages
    const messages = [];
    const promises = [];

    for (let i = 0; i < count; i++) {
      // Randomly select a message type from the provided types
      const type = types[Math.floor(Math.random() * types.length)];
      // Randomly determine if it should be phishing (roughly 50/50)
      const isPhishing = Math.random() < 0.5;

      promises.push(messageGenerator.generateCreativeMessage(type, isPhishing));
    }

    const generatedMessages = await Promise.all(promises);

    res.json({
      count: generatedMessages.length,
      messages: generatedMessages,
    });
  } catch (error) {
    console.error("Error generating batch messages:", error);
    res.status(500).json({ error: "Failed to generate message batch" });
  }
});

module.exports = router;
