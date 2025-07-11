import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/errors';


export const validateBookingId = (req: Request, res: Response, next: NextFunction): void => {
  const { bookingId } = req.params;
  if (!bookingId || isNaN(Number(bookingId))) {
    throw new BadRequestError({
      message: "Invalid bookingId", 
      from: "validateBookingId middleware" 
    });
  }
  next();
};