const jwt = require('jsonwebtoken');

const getusersByIdMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || req.cookies['token'];
    if(!authHeader)return res.status(400).json({message: "cookie is not available"})
    if (authHeader) {
       
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                
                return res.status(403).json({ message: 'Invalid or expired token ' });
            }
            req.user = user.id;
            
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization header missing or invalid in get users  by id middleware' });

    }
};

module.exports = getusersByIdMiddleware;
