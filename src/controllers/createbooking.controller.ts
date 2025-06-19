import { Request, Response } from 'express';
import { createBooking } from '../services/booking.service';
import { UserRole } from '../types/types';
import { BookingValidationError } from '../errors/errors';

export interface CreateBookingRequest {
  facilityId: bigint;
  farmerId: bigint;
  startDate: Date;
  endDate: Date;
  amount?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const createBookingHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('Route hit!');
  try {

      const bookingData: CreateBookingRequest = {
      facilityId: req.body.facilityId,
      farmerId: req.farmer.id,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      amount: req.body.amount,
    };

    console.log(bookingData)

     if(!bookingData.facilityId){
      res.status(400).json({
        success: false,
        message: "facility ID required",
        error: "facility ID required"
      });
      return
    }

    const booking = await createBooking(bookingData);

   
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  
  } catch (error) {
    console.log(error)
    // Re-throw our custom errors
    // if (error instanceof BookingValidationError) {
    //   res.status(400).json({
    //     status: "Failed",
    //     message: error.message,
    //   })
    //   throw error;
    // }
    // throw new Error("Database operation failed");
  }
};