import { UserRole } from '@prisma/client';
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
export const authenticateJWT = (req, res, next) => {
    try {
        // For mock purposes
        const authHeader = req.headers['mock-user'];
        if (!authHeader) {
            res.status(403).json({
                status: 'Failed',
                message: 'Unauthorized (Try specing a mock user)'
            });
            return;
        }
        ;
        const user = MOCK_USER.find(user => user.email === authHeader);
        if (!user) {
            res.status(403).json({
                status: 'Failed',
            });
            return;
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        // res.send(user)
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: 'Unable to authenticate'
        });
        console.log(error);
    }
};
// Role Middleware
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
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
