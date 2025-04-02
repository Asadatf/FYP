import db from "../index.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";




///Signup Function
export const signup = async (req, res) => {
    try {
      const { username, email, password, profile_picture } = req.body;
      
      // Check if user already exists
      db.query('SELECT * FROM USERS WHERE email = ?', [email], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error occurred' });
        }
        
        if (results.length > 0) {
          return res.status(409).json({ error: 'User already exists with this email' });
        }
        
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // Create new user
        const newUser = {
          username,
          email,
          password: passwordHash,
          profile_picture: profile_picture || null,
          created_at: new Date(),
          last_login: new Date(),
          is_active: true,
          external_auth_id: '' // Use empty string instead of null
        };
        
        db.query('INSERT INTO USERS SET ?', newUser, (err, result) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Failed to create user' });
          }
          
          // Generate JWT token
          const user = { id: result.insertId, email, username };
          const token = jwt.sign(
            { user_id: user.id, email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          res.status(201).json({
            message: 'User created successfully',
            user: {
              id: result.insertId,
              username,
              email
            },
            token
          });
        });
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
      
      // Find user by email
      db.query('SELECT * FROM USERS WHERE email = ?', 
        [email],
        async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error occurred' });
        }
        
        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        
        // If this is a Google account without password
        if (!user.password) {
          return res.status(401).json({ error: 'Please use Google to sign in' });
        }
        
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Update last login time
        db.query('UPDATE USERS SET last_login = NOW() WHERE user_id = ?', [user.user_id]);
        
        // Generate JWT token
        const token = jwt.sign(
          { user_id: user.user_id, email: user.email },
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