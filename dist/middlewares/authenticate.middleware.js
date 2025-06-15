import jwt from 'jsonwebtoken';
import { UserRole } from '../types/types';
import { BadRequestError, UnauthorizedError } from '../errors/errors';
import { config } from '../config/config.env';
const MOCK_USER = [
    {
        id: 'farmer-1',
        email: 'farmer@example.com',
        role: UserRole.FARMER
    },
    {
        id: 'owner-1',
        email: 'owner@example.com',
        role: UserRole.INFRA_OWNER
    }
];
export const verifyAuth = (req, _res, next) => {
    // mock authentication for demonstration purposes
    req.currentUser = MOCK_USER[Math.floor(Math.random() * MOCK_USER.length)];
    // end of mock authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError({ message: "Authorization header missing or invalid", from: "authenticateJWT()" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.currentUser = decoded;
        next();
    }
    catch (err) {
        throw new BadRequestError({ message: `JWT auth error${err}`, from: "authenticateJWT()" });
    }
};
// Role Middleware
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            res.status(403).json({
                status: 'Failed',
                message: "Unauthorized"
            });
            return;
        }
        ;
        next();
    };
};
