
// import { Request, Response, NextFunction } from "express";
//import { validationResult } from "express-validator";
// import { body } from "express-validator";
// import { ValidationChain } from "express-validator";

// export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors: errors.array(),
//     });
//     return;
//   }
//   next();
// };


export interface BookingRequestBody {
  facilityId: number;
  farmerId: number;
  startDate: string | Date;
  endDate: string | Date;
  amount?: number;
}

// export const validateBooking = [
//   body('facilityId')
//     .isInt({ min: 1 }).withMessage('facilityId must be a positive integer')
//     .toInt(),
  
//   body('farmerId')
//     .isInt({ min: 1 }).withMessage('farmerId must be a positive integer')
//     .toInt(),

//   body('startDate')
//     .isISO8601().withMessage('startDate must be a valid date')
//     .toDate(),

//   body('endDate')
//     .isISO8601().withMessage('endDate must be a valid date')
//     .toDate()
//     .custom((value: string | Date, { req }: { req: { body: BookingRequestBody } }) => {
//       if (new Date(value) <= new Date(req.body.startDate)) {
//         throw new Error('endDate must be after startDate');
//       }
//       return true;
//     }),

//   body('amount')
//     .optional()
//     .isFloat({ gt: 0 }).withMessage('amount must be a positive number')
//     .toFloat(),
// ];
