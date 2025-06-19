import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Farmer, Operator, UserRole } from "../types/types";
import { BadRequestError, UnauthorizedError } from "../errors/errors";
import { config } from "../config/config.env";
import { prisma } from "../config/config.db";

declare global {
  namespace Express {
    interface Request {
      currentUser: {
        id: string;
        email: string;
        role: UserRole;
      };
      operator: Operator;
      farmer: Farmer;
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
    console.log(decoded);
    const decodeUser = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role
    };

    if (decodeUser.role === UserRole.OPERATOR) {
      const operator = await prisma.operator.findFirst({
        where: { user_id: decodeUser.id } // user_id is unique
      });
      if (operator) {
        req.operator = operator as unknown as Operator;
        req.currentUser = decodeUser;
        next();
        return;
      }
    } 
    else if (decodeUser.role === UserRole.FARMER) {
      const farmer = await prisma.farmer.findUnique({
        where: { user_id: decodeUser.id } // user_id is unique
      });
      
      console.log("FAMER: ",farmer)

      if (farmer) {
        req.farmer = farmer as unknown as Farmer;
        req.currentUser = decodeUser;
        next();
        return;
      }
    }
  } catch {

    } else if (decodeUser.role === UserRole.FARMER) {
      const farmer = await prisma.farmer.findFirst({
        where: { user_id: decodeUser.id } // user_id is unique
      });

      if (farmer) {
        req.farmer = farmer as unknown as Farmer;
        req.currentUser = decodeUser;
        next();
        return;
      }
   }

// Role Middleware
export const authorizeRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.currentUser.role)) {
      res.status(403).json({
        status: "Failed",
        message: "Unauthorized"
      });
      return;
    }
    next();
  };
};
