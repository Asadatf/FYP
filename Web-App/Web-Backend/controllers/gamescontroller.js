import db from "../index.js"

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
        is_active 
      } = req.body;
      
      // Validate required fields
      if (!title || !difficulty_level || !category || !points_possible) {
        return res.status(400).json({ 
          error: 'Missing required fields. Title, difficulty level, category, and points possible are required.' 
        });
      }
      
      // Create new game object
      const newGame = {
        title,
        description: description || '',
        difficulty_level,
        category,
        points_possible,
        game_url: game_url || '',
        // Store the path directly from request
        game_thumbnail: game_thumbnail || null,
        is_active: is_active !== undefined ? is_active : true
      };
      
      // Insert the new game
      db.query('INSERT INTO GAMES SET ?', newGame, (err, result) => {
        if (err) {
          console.error('Error creating game:', err);
          return res.status(500).json({ error: 'Failed to create game' });
        }
        
        // Return success response with the new game ID
        res.status(201).json({
          message: 'Game created successfully',
          game: {
            game_id: result.insertId,
            ...newGame
          }
        });
      });
    } catch (error) {
      console.error('Create game error:', error);
      res.status(500).json({ error: 'Game creation failed' });
    }
  };

  export const getAllGames = async (req, res) => {
    try {
      const { is_active } = req.query;
      
      // Base query
      let query = "SELECT * FROM GAMES";
      const queryParams = [];
  
      // Filter by is_active if provided
      if (is_active !== undefined) {
        query += " WHERE is_active = ?";
        queryParams.push(is_active === "true" || is_active === "1");
      }
  
      // Execute query
      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error occurred" });
        }
  
        res.status(200).json({
          count: results.length,
          games: results,
        });
      });
    } catch (error) {
      console.error("Get games error:", error);
      res.status(500).json({ error: "Failed to retrieve games" });
    }
  };
  