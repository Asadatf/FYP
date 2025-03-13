const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Get top scores
router.get('/top', async (req, res) => {
    try {
        const topScores = await Score.find()
            .sort({ score: -1 })
            .limit(10);
        res.json(topScores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

// Save new score
router.post('/', async (req, res) => {
    try {
        const { score, playerName } = req.body;
        const newScore = new Score({ score, playerName });
        await newScore.save();
        res.json(newScore);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save score' });
    }
});

module.exports = router;
