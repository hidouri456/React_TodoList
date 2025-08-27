const jwt = require('jsonwebtoken');
const dbPromise = require('./database.cjs');


const JWT_SECRET = 'your-super-secret-and-long-key-that-is-hard-to-guess';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM users WHERE id = ?', decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;

