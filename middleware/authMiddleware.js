const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // check token exists
    if (!authHeader) {
        return res.status(401).json({
            message: 'Token required'
        });
    }

    // Bearer token
    const token = authHeader.split(' ')[1];

    // if (!token) {
    //     return res.status(401).json({
    //         message: 'Invalid token format'
    //     });
    // }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret123'
        );

        console.log(decoded)
        // user data req me store
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: 'Invalid or Expired Token'
        });
    }
};

module.exports = authMiddleware;