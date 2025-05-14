import db from "../index.js";
export const saveGameScore = async (req, res) => {
  try {
    // Extract user_id from the verified token
    const { user_id } = req.user;

    // Extract game data from request body
    const { game_id, score } = req.body;

    console.log("Score Received: ", score);
    score.to;
    // Validate required fields
    if (!game_id || score === undefined) {
      return res.status(400).json({
        error: "Missing required fields. Game ID and score are required.",
      });
    }

    // Check if game exists
    const gameExists = await db.query(
      "SELECT * FROM games WHERE game_id = $1",
      [game_id]
    );
    if (gameExists.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Check if user has a previous score for this game
    const existingScore = await db.query(
      "SELECT * FROM game_sessions WHERE user_id = $1 AND game_id = $2",
      [user_id, game_id]
    );

    let result;
    if (existingScore.rows.length > 0) {
      // Update existing score if new score is higher
      if (score > existingScore.rows[0].score) {
        result = await db.query(
          "UPDATE game_sessions SET score = $1, last_played = NOW() WHERE user_id = $2 AND game_id = $3 RETURNING *",
          [score, user_id, game_id]
        );
      } else {
        // Just update last_played timestamp if score isn't higher
        result = await db.query(
          "UPDATE game_sessions SET last_played = NOW() WHERE user_id = $1 AND game_id = $2 RETURNING *",
          [user_id, game_id]
        );
      }
    } else {
      // Insert new score record
      result = await db.query(
        "INSERT INTO game_sessions (user_id, game_id, score, last_played) VALUES ($1, $2, $3, NOW()) RETURNING *",
        [user_id, game_id, score]
      );
    }

    // Return success response
    res.status(200).json({
      message: "Game score saved successfully",
      score: result.rows[0],
      is_high_score:
        existingScore.rows.length === 0 || score > existingScore.rows[0].score,
    });
  } catch (error) {
    console.error("Save game score error:", error);
    res.status(500).json({ error: "Failed to save game score" });
  }
};

export const getGameScore = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { game_id } = req.params;

    const existingScore = await db.query(
      "SELECT score FROM game_sessions WHERE user_id = $1 AND game_id = $2",
      [user_id, game_id]
    );

    if (existingScore.rows.length > 0) {
      res.status(200).json({ score: existingScore.rows[0].score });
    } else {
      res.status(200).json({ score: 0 });
    }
  } catch (error) {
    console.error("Fetch latest score error:", error);
    res.status(500).json({ error: "Failed to fetch latest score" });
  }
};
