const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key_here';

module.exports = (req, res, next) => {
  // Attempt to retrieve the token from the HTTP-only cookie
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded token payload (user details) to the request
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(400).json({ message: 'Invalid token' });
  }
};
