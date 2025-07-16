import { Request, Response, NextFunction } from 'express';
import { Facility, UserRole } from '../types/types';
import { prisma } from '../config/config.db';
import { UnauthorizedError } from '../errors/errors';

declare global {
    namespace Express {
        interface Request {
            facility: Facility
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
    throw new UnauthorizedError({message: "User must be a registered operator", 
      from: "isOperator middleware"
    });
  }
  next();
};

export const isAuthorizedOperator = async (req: Request, res: Response, next: NextFunction) => {
  const operator = await prisma.operator.findUnique({
    where: { user_id: req.currentUser.id },
  });

  if(!operator || Number(operator?.id) !== req.body.operatorId) {
    throw new UnauthorizedError({message: "User must be authorized operator", 
      from: "isAuthorizedOperator middleware"
    });
  }
  next();
};

export const isFarmer = (req: Request, res: Response, next: NextFunction) => {
  if(!req.currentUser || req.currentUser.role !== UserRole.FARMER) {
    throw new UnauthorizedError({message: "User must be a registered farmer", from: "isfarmer middleware"})
  }
  next();
};

export const isFacilityOwner = async (req: Request, _res: Response, next: NextFunction) => {
   const facilityId = Number(req.params.facilityId);

  try {

    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { operator: true }
    });

    if (!facility || facility.operator.user_id !== req.currentUser.id) {
      throw new UnauthorizedError({message: "User must be the facility owner", from: "isFacilityOwner middleware"})
    };

    req.facility = facility as unknown as Facility;
    next();

  } catch(error){
    throw new UnauthorizedError({
      message: "User must be the facility owner", 
      from: "isFacilityOwner middleware",
      cause: error 
    })
  }
};
