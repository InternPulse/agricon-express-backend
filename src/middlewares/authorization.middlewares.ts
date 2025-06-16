import { Request, Response, NextFunction } from 'express';
  import jwt from 'jsonwebtoken';
import { Facility, UserRole } from '../types/types';
import { BadRequestError, UnauthorizedError } from '../errors/errors';
import { config } from '../config/config.env';
import prisma from '../database';

declare global {
    namespace Express {
        interface Request {
            facility: Facility
        }
    }
}

// Role Middleware
export const authorizeRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if(!roles.includes(req.currentUser .role)){
      throw new UnauthorizedError({message: "unauthorized", from: "authorization middleware"})
    };
    next();
  }
}

export const isAnOperator = (req: Request, res: Response, next: NextFunction) => {
  if(!req.currentUser || req.currentUser.role !== UserRole.OPERATOR) {
    throw new UnauthorizedError({message: "user must be a registered operator", from: "isAnOperator middleware"})
  }

  next();
}

export const isFacilityOwner = async (req: Request, res: Response, next: NextFunction) => {
   const facilityId = req.params.facilityId;
   const currentUserId = req.currentUser?.id; 

  try {
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId, operatorId: currentUserId }
    });

    if (!facility) {
      throw new UnauthorizedError({message: "must be the facility operator", from: "isFacilityOwner middleware"})
    }

    req.facility = facility as unknown as Facility; // Attach facility to request object

    next();
  } catch (error) {
    throw new UnauthorizedError({message: `Server error ${error}`, from: "isFacilityOwner middleware"})
  }
}
