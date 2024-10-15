// Middleware to validate user input for registration and login
const validateUser = (req, res, next) => {
    const { email, password, userType, role } = req.body;
    if (!email || !password || !userType || !role) {
        return res.status(400).json({ message: 'Email, password, userType, and role are required.' });
    }
    next();
};

module.exports = validateUser;
