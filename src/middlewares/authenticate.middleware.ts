import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../types/types";
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
        farmerId?: bigint;
        operatorId?: bigint;
      };
    }
  }
}

type CachedUser = {
  user_id: string;
  email: string;
  role: string;
  farmerId?: bigint;
  operatorId?: bigint;
};

const userCache = new Map<number, CachedUser>();

export const verifyAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError({
      message: "Authorization header missing or invalid",
      from: "authenticateJWT()",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!config.JWT_SECRET || typeof config.JWT_SECRET !== "string") {
    throw new BadRequestError({
      message: `JWT auth error, secret key is missing or invalid`,
      from: "authenticateJWT()",
    });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET as string) as {
      user_id: string;
      email: string;
      role: UserRole;
    };
    //
    let cachedUserEntry;

    cachedUserEntry = userCache.get(Number(decoded.user_id));

    if (!cachedUserEntry) {
      if (decoded.role === UserRole.FARMER) {
        const farmer = await prisma.farmer.findUnique({
          where: { user_id: decoded.user_id },
        });

        if (farmer) {
          cachedUserEntry = {
            ...decoded,
            farmerId: farmer.id,
          };
        }
      } else if (decoded.role === UserRole.OPERATOR) {
        const operator = await prisma.operator.findUnique({
          where: { user_id: decoded.user_id },
        });

        if (operator) {
          cachedUserEntry = {
            ...decoded,
            operatorId: operator.id,
          };
        }
      }

      if (!cachedUserEntry)
        throw new UnauthorizedError({
          message: "User not found",
          from: "authenticateJWT()",
        });

      userCache.set(Number(decoded.user_id), cachedUserEntry);
    }

    const decodeUser = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      farmerId: cachedUserEntry.farmerId,
      operatorId: cachedUserEntry.operatorId,
    };

    req.currentUser = decodeUser;
    next();
  } catch (error) {
    console.log(error);

    throw new BadRequestError({
      message: `JWT auth error`,
      from: "authenticateJWT()",
      cause: error,
    });
  }
};

// Role Middleware
export const authorizeRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.currentUser.role)) {
      throw new BadRequestError({
        message: `Failed`,
        from: "authorizeRole()",
      });
    }
    next();
  };
};
