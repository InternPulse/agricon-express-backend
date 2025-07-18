import { Request, Response, NextFunction } from 'express';
import { Facility, UserRole } from '../types/types';
import { prisma } from '../config/config.db';
import { UnauthorizedError } from '../errors/errors';
import { Farmer, Operator } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            facility: Facility;
            operator: Operator;
            farmer: Farmer
        }
    }
}

// Role Middleware
export const authorizeRole = (req: Request, _res: Response, next: NextFunction): void => {
  if(!Object.keys(UserRole).includes(req.currentUser?.role)){
    throw new UnauthorizedError({message: "unauthorized", 
      from: "authorizeRole: authorization middleware"
    });
  };
  next();
};

export const isOperator = (req: Request, res: Response, next: NextFunction) => {
  if(!req.currentUser || req.currentUser.role !== UserRole.OPERATOR) {
    throw new UnauthorizedError({
      message: "User must be a registered operator", 
      from: "isOperator middleware"
    });
  }
  next();
};


export const isFarmer = (req: Request, res: Response, next: NextFunction) => {
  if(!req.currentUser || req.currentUser.role !== UserRole.FARMER) {
    throw new UnauthorizedError({
      message: "User must be a registered farmer", 
      from: "isfarmer middleware"})
  }
  next();
};


export const isAuthorizedOperator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const operatorId = req.currentUser.operatorId;
    if (!operatorId) {
      throw new UnauthorizedError({
        message: "Operator ID not found in token",
        from: "isAuthorizedOperator middleware",
      });
    };

    const operator = await prisma.operator.findUnique({
      where: { id: operatorId },
    });

    if (!operator) {
      throw new UnauthorizedError({
        message: "User must be an authorized Operator",
        from: "isAuthorizedOperator middleware",
      });
    }

    req.operator = operator;  // Make operator available downstream
    next();
  } catch (error) {
    next(error);
  }
};


export const isAuthorizedFarmer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmerId = req.currentUser.farmerId;
    if (!farmerId) {
      throw new UnauthorizedError({
        message: "Farmer ID not found in token",
        from: "isAuthorizedFarmer middleware",
      });
    }


    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId },
    });

    if (!farmer) {
      throw new UnauthorizedError({
        message: "User must be an authorized farmer",
        from: "isAuthorizedFarmer middleware",
      });
    }

    req.farmer = farmer; // Make farmer available downstream
    next();
  } catch (error) {
    next(error);
  }
};


export const isFacilityOwner = async (req: Request, _res: Response, next: NextFunction) => {
  const facilityId = Number(req.params.facilityId);

  try {
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { operator: true },
    });

    if (!facility || facility.operator.user_id !== req.currentUser.id) {
      throw new UnauthorizedError({
        message: "User must be the facility owner",
        from: "isFacilityOwner middleware",
      });
    }

    req.facility = facility as any; // Make facility available downstream
    next();
  } catch (error) {
    throw new UnauthorizedError({
      message: "User must be the facility owner",
      from: "isFacilityOwner middleware",
      cause: error,
    });
  }
};
