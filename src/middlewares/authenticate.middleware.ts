import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../types/types";
import { BadRequestError, UnauthorizedError } from "../errors/errors";
import { config } from "../config/config.env";

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

export const verifyAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError({
      message: "Authorization header missing or invalid",
      from: "authenticateJWT()"
    });
  }

  const token = authHeader.split(" ")[1];
  if (!config.JWT_SECRET || typeof config.JWT_SECRET !== "string") {
    throw new BadRequestError({
      message: `JWT auth error, secret key is missing or invalid`,
      from: "authenticateJWT()"
    });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET as string) as {
      user_id: string;
      email: string;
      role: UserRole;
    };

    const decodeUser = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role
    };

    req.currentUser = decodeUser;
    next();

  } catch(error) {
    console.log(error);
    
     throw new BadRequestError({
      message: `JWT auth error`,
      from: "authenticateJWT()",
      cause: error
    });
  }
}

// Role Middleware
export const authorizeRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.currentUser.role)) {
      throw new BadRequestError({
      message: `Failed`,
      from: "authorizeRole()"
    });
  }
    next();
  };
};
