import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/errors';

export const validateBookingId = (req: Request, res: Response, next: NextFunction): void => {
  const { bookingId } = req.params;
  
  if (!bookingId) {
    throw new BaseError('Booking ID is required', 400);
  }
  
  if (typeof bookingId !== 'string' || bookingId.trim() === '') {
    throw new BaseError('Booking ID must be a valid string', 400);
  }
  
  next();
};