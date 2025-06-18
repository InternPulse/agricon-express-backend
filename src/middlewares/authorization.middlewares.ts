import { Request, Response, NextFunction } from 'express';
import { Facility, UserRole } from '../types/types';
import { UnauthorizedError } from '../errors/errors';
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
    if(!roles.includes(req.currentUser.role)){
      throw new UnauthorizedError({message: "unauthorized", from: "authorization middleware"})
    };
    next();
  }
}

export const isAnOperator = (req: Request, res: Response, next: NextFunction) => {
  if(!req.currentUser || req.currentUser.role !== UserRole.INFRA_OWNER) {
    throw new UnauthorizedError({message: "user must be a registered operator", from: "isAnOperator middleware"})
  }

  next();
}

export const isFacilityOwner = async (req: Request, _res: Response, next: NextFunction) => {
   const facilityId = req.params.facilityId;
   const currentUserId = req.currentUser?.id; 

  try {
   const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
    });

    if (!facility || facility.operatorId !== currentUserId) {
      throw new UnauthorizedError({message: "must be the facility operator", from: "isFacilityOwner middleware"})
    }

    req.facility = facility as unknown as Facility; // Attach facility to request object

    next();
  } catch (error) {
    throw new UnauthorizedError({message: `Server error ${error}`, from: "isFacilityOwner middleware"})
  }
}
