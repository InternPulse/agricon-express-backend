import { Request, Response, NextFunction } from 'express';
import { Facility, UserRole } from '../types/types';
import { prisma } from '../config/config.db';
import { UnauthorizedError, BaseError } from '../errors/errors';
import { mockBookings } from '../data/mockBookings';

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

export const isFacilityOwner = async (req: Request, _res: Response, next: NextFunction) => {
   const facilityId = Number(req.params.facilityId);
   const operatorId = req.operator?.id; 

  try {

    const facility = await prisma.facility.findUnique({
      where: { id: facilityId }
    })
    
    if (!facility || facility.operatorId !== operatorId) {
      throw new UnauthorizedError({message: "must be the facility operator", from: "isFacilityOwner middleware"})
    }

    req.facility = facility as unknown as Facility; // Attach facility to request object

    next();
  } catch (error) {
    throw new UnauthorizedError({message: `Server error ${error}`, from: "isFacilityOwner middleware"})
  }
}

export const checkBookingOwnership = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const farmerId = req.currentUser.id;

    const booking = mockBookings.find(b => b.id === bookingId);

    if (!booking) {
      throw new BaseError('Booking not found', 404);
    }

    if (booking.farmerId !== farmerId) {
      throw new BaseError('Unauthorized to access this booking', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};