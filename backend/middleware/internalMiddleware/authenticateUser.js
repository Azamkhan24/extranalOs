const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  try {
    // Get the token from the cookies
    const token = req.cookies.token;


    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user ID to the request object
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token', error: error.message });
  }
};

module.exports = authenticateUser;
