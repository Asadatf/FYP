import db from "../index.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";




///Signup Function
export const signup = async (req, res) => {
  try {
    const { username, email, password, profile_picture } = req.body;

    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const now = new Date();
    
    // Insert new user and return the user_id
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, profile_picture, created_at, last_login, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id', 
      [username, email, passwordHash, profile_picture || null, now, now, true]
    );

    // Get the newly created user id
    const userId = result.rows[0].user_id;

    // Generate JWT token
    const token = jwt.sign(
      { user_id: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userId,
        username,
        email
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
};






///Login Functions
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email - using async/await pattern with PostgreSQL
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // If this is a Google account without password
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Please use Google to sign in' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login time
    await db.query('UPDATE users SET last_login = $1 WHERE user_id = $2', [new Date(), user.user_id]);

    // Generate JWT token 
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        // profile_picture: user.profile_picture
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};


  //logout funtion
  export const logout = async (req, res) => {
    try {
      // Optionally, handle token blacklisting (if required)
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  };