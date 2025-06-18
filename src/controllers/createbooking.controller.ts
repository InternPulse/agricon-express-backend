import { Request, Response } from 'express';
import { createBooking } from '../services/booking.service';
import { UserRole } from '../types/types';

export interface CreateBookingRequest {
  facilityId: string;
  farmerId: string;
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
  // Guard against multiple responses
  if (res.headersSent) {
    return;
  }

  if (!req.currentUser || !req.currentUser.id) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  try {
    const bookingData: CreateBookingRequest = {
      facilityId: req.body.facilityId,
      farmerId: req.currentUser.id, 
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      amount: req.body.amount,
    };

    const booking = await createBooking(bookingData);
    
    if (!res.headersSent) {
      res.status(201).json(booking);
    }
  } catch (error: any) {
    if (res.headersSent) {
      return;
    }

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
      return;
    }

    if (error.name === 'NotFoundError') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }

    if (error.name === 'ConflictError') {
      res.status(409).json({ 
        success: false, 
        message: error.message 
      });
      return;
    }

    // Fallback for unexpected errors
    console.error('Booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create a booking' 
    })
}}