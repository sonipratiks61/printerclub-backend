const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';

exports.refreshToken = (req, res) => {
    
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    jwt.verify(refreshToken, refreshJwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Refresh token is invalid or expired.' });
        }

       
        const accessToken = jwt.sign({ id: decoded.id }, jwtSecret, { expiresIn: '15m' });

       
        return res.status(200).json({ accessToken });
    });
};
const authMiddleware = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Authorization token required or malformed.' });
    }

    token = token.slice(7, token.length);

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Token is invalid or expired.' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = authMiddleware;