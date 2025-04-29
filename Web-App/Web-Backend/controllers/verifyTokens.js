import jwt from 'jsonwebtoken'


export const verifyToken = (req, res) => {
  const token = req.headers.auth; // Directly get the token
  console.log("Token", token);
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach user data to request
    console.log(req.user)
    return res.status(200).json({
      message: 'Token verified',
      user: req.user, // this includes user_id and email
    });
    // next(); // Move to next middleware or route handler
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Invalid token' });
  }
};