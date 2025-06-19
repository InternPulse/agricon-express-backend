import { Request, Response, NextFunction } from 'express';
// import  validationResult  from 'express-validator';
import { BaseError } from '../errors/errors';

// export const validateBookingInput = [
//   (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       throw new BaseError('Validation failed', 400, errors.array());
//     }
//     next();
//   },
// ];

export const validateBookingId = (req: Request, res: Response, next: NextFunction): void => {
  const { bookingId } = req.params;
  if (!bookingId || isNaN(Number(bookingId))) {
    throw new BaseError('Invalid booking ID', 400);
  }
  next();
};