import db from "../index.js";

export const createGame = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty_level,
      category,
      points_possible,
      game_url,
      game_thumbnail,
      is_active,
    } = req.body;

    // Validate required fields
    if (!title || !difficulty_level || !category || !points_possible) {
      return res.status(400).json({
        error:
          "Missing required fields. Title, difficulty level, category, and points possible are required.",
      });
    }

    // Insert the new game using PostgreSQL syntax
    const result = await db.query(
      "INSERT INTO games (title, description, difficulty_level, category, points_possible, game_url, game_thumbnail, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING game_id",
      [
        title,
        description || "",
        difficulty_level,
        category,
        points_possible,
        game_url || "",
        game_thumbnail || null,
        is_active !== undefined ? is_active : true,
      ]
    );

    // Get the new game ID
    const gameId = result.rows[0].game_id;

    // Return success response with the new game ID
    res.status(201).json({
      message: "Game created successfully",
      game: {
        game_id: gameId,
        title,
        description: description || "",
        difficulty_level,
        category,
        points_possible,
        game_url: game_url || "",
        game_thumbnail: game_thumbnail || null,
        is_active: is_active !== undefined ? is_active : true,
      },
    });
  } catch (error) {
    console.error("Create game error:", error);
    res.status(500).json({ error: "Game creation failed" });
  }
};

// Permanently delete a game by ID
export const deleteGameById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if game exists
    const checkResult = await db.query(
      "SELECT * FROM games WHERE game_id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Permanently delete the game
    await db.query("DELETE FROM games WHERE game_id = $1", [id]);

    res.status(200).json({ message: "Game deleted permanently" });
  } catch (error) {
    console.error("Delete game error:", error);
    res.status(500).json({ error: "Failed to delete game" });
  }
};

export const getAllGames = async (req, res) => {
  try {
    const { is_active } = req.query;

    // Base query
    let query = "SELECT * FROM games";
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
      games: result.rows,
    });
  } catch (error) {
    console.error("Get games error:", error);
    res.status(500).json({ error: "Failed to retrieve games" });
  }
};
