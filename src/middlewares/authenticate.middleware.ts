import { Request, Response, NextFunction } from 'express';
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
      role: UserRole.OPERATOR
    }
];


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
  // Mock authentication for demonstration purposes
  
  // Check for X-Mock-User header to control which user to use
  const mockUserId = req.headers['x-mock-user'] as string;
  
  let selectedUser;
  if (mockUserId) {
    // Use specific user if header is provided
    selectedUser = MOCK_USER.find(user => user.id === mockUserId);
    if (!selectedUser) {
      throw new BadRequestError({
        message: `Mock user '${mockUserId}' not found. Available: ${MOCK_USER.map(u => u.id).join(', ')}`, 
        from: "verifyAuth()"
      });
    }
  } else {
   // Random selection if no header specified
  selectedUser = MOCK_USER[Math.floor(Math.random() * MOCK_USER.length)];
  }
  console.log(`🎲 Random user selected: ${selectedUser.id}`); 
  req.currentUser = selectedUser;
  next();
  // remove this line below(return statement) when done testing mock data
  // return; 

  // end of mock authentication
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
   throw new UnauthorizedError({message: "Authorization header missing or invalid", from: "authenticateJWT()"});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.currentUser = decoded as { id: string; email: string; role: UserRole };
    next();
  } catch (err) {
    throw new BadRequestError({message: `JWT auth error${err}`, from: "authenticateJWT()"});
  }
};


// Role Middleware
export const authorizeRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if(!roles.includes(req.currentUser .role)){
      res.status(403).json({
        status: 'Failed',
        message: "Unauthorized"
      });
      return 
    };
    next();
  }
}

