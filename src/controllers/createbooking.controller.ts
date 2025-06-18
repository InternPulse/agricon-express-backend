import { Request, Response } from 'express';
import { createBooking } from '../services/booking.service';
import { UserRole } from '../types/types';

export interface CreateBookingRequest {
  facilityId: string |number |bigint;
  farmerId: string |number | bigint;
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
  try {

    if (!req.currentUser || !req.currentUser.id) {
       res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return
    }
  
    const bookingData: CreateBookingRequest = {
      facilityId: req.body.facilityId,
      farmerId: req.currentUser.id,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      amount: req.body.amount,
    };

    console.log(bookingData)

     if(!bookingData.facilityId){
      res.status(404).json({
        success: false,
        message: "facility ID required"
      });
      return
    }

    const booking = await createBooking(bookingData);

   
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
    
  } catch (error: any) {
    if (res.headersSent) return;

    if (error.name === 'ValidationError') {
     res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
       return 
    }

    if (error.name === 'NotFoundError') {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return 
    }

    if (error.name === 'ConflictError') {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return 
    }

    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create a booking',
    });
    return 
  }
};
