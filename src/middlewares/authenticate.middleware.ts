// import { Request, Response, NextFunction } from 'express';
//   import jwt from 'jsonwebtoken';
// import { UserRole } from '../types/types';
// import { BadRequestError, UnauthorizedError } from '../errors/errors';
// import { config } from '../config/config.env';


// const MOCK_USER = [
//     {
//         id: 'farmer-1',
//         email: 'farmer@example.com',
//         role: UserRole.FARMER
//     },
//     {
//       id: 'owner-1',
//       email: 'owner@example.com',
//       role: UserRole.OPERATOR
//     }
// ];


// declare global {
//     namespace Express {
//         interface Request {
//             currentUser: {
//               id: string;
//               email: string;
//               role: UserRole;
//             }
//         }
//     }
// }


// export const verifyAuth = (req: Request, _res: Response, next: NextFunction): void => {
//   // mock authentication for demonstration purposes
//   req.currentUser = MOCK_USER[Math.floor(Math.random() * MOCK_USER.length)];
//   next();
//   // end of mock authentication
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//    throw new UnauthorizedError({message: "Authorization header missing or invalid", from: "authenticateJWT()"});
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, config.JWT_SECRET);
//     req.currentUser = decoded as { id: string; email: string; role: UserRole };
//     next();
//   } catch (err) {
//     throw new BadRequestError({message: `JWT auth error${err}`, from: "authenticateJWT()"});
//   }
// };


// // Role Middleware
// export const authorizeRole = (roles: UserRole[]) => {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     if(!roles.includes(req.currentUser .role)){
//       res.status(403).json({
//         status: 'Failed',
//         message: "Unauthorized"
//       });
//       return 
//     };
//     next();
//   }
// }



import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/types';
import { BadRequestError, UnauthorizedError } from '../errors/errors';
import { config } from '../config/config.env';

const MOCK_USER = [
    {
        id: 'mock-user-farmer-1',
        email: 'alice@farm.com',
        role: UserRole.FARMER
    },
    {
        id: 'mock-user-farmer-2',
        email: 'bob@crops.com',      // ✅ Now this matches your header
        role: UserRole.FARMER
    },
    {
        id: 'mock-user-operator-1',
        email: 'john@farmequipment.com',
        role: UserRole.INFRA_OWNER
    },
    {
        id: 'mock-user-operator-2',
        email: 'info@agritech.com',
        role: UserRole.INFRA_OWNER
    }
];

// Add a flag to control mock vs real auth
const USE_MOCK_AUTH = process.env.USE_MOCK_AUTH === 'true' || true; // Set to false when real auth is ready

declare global {
    namespace Express {
        interface Request {
            currentUser: {
                id: string;
                email: string;
                role: UserRole;
            }
        }
    }
}

export const verifyAuth = (req: Request, _res: Response, next: NextFunction): void => {
    if (USE_MOCK_AUTH) {
        // Mock authentication - select user based on header or random
        const mockUserEmail = req.headers['mock-user'] as string;
        
        if (mockUserEmail) {
            // Find specific mock user by email
            const mockUser = MOCK_USER.find(user => user.email === mockUserEmail);
            if (mockUser) {
                req.currentUser = mockUser;
            } else {
                // If email not found, use random user
                req.currentUser = MOCK_USER[Math.floor(Math.random() * MOCK_USER.length)];
            }
        } else {
            // No specific user requested, use random
            req.currentUser = MOCK_USER[Math.floor(Math.random() * MOCK_USER.length)];
        }
        
        next();
        return; // Important: Exit here to prevent JWT verification
    }

    // Real JWT authentication (only runs when USE_MOCK_AUTH is false)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError({
            message: "Authorization header missing or invalid", 
            from: "authenticateJWT()"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.currentUser = decoded as { id: string; email: string; role: UserRole };
        next();
    } catch (err) {
        throw new BadRequestError({
            message: `JWT auth error: ${err}`, 
            from: "authenticateJWT()"
        });
    }
};

// Role Middleware (keep as is, but fix the spacing issue)
export const authorizeRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!roles.includes(req.currentUser.role)) {
            res.status(403).json({
                status: 'Failed',
                message: "Unauthorized"
            });
            return;
        }
        next();
    }
}