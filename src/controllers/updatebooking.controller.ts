import { Request, Response } from 'express';
import { BaseError } from '../errors/errors';
import { prisma } from '../config/config.db';
import { updateBooking } from '../services/db/booking.service';

export interface UpdateBookingRequest {
  startDate?: Date;
  endDate?: Date;
}

export const updateBookingHandler = async (req: Request, res: Response)=> {
  try {
    const { bookingId } = req.params;

    const bookingData: UpdateBookingRequest = {
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
    };

    if (bookingData.startDate && bookingData.endDate && bookingData.startDate >= bookingData.endDate) {
      res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
      return;
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { farmer: true }
    });

    if (!existingBooking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found or does not exist'
      });
      return;
    }

    if (existingBooking.farmer.user_id !== req.currentUser.id) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own bookings'
      });
      return;
    }
    
    if (bookingData.startDate || bookingData.endDate) {
      const startDate = bookingData.startDate || existingBooking.startDate;
      const endDate = bookingData.endDate || existingBooking.endDate;

      const overlappingBooking = await prisma.booking.findFirst({
        where: {
          facilityId: existingBooking.facilityId,
          id: { not: Number(bookingId) }, 
          OR: [
            {
              startDate: { lte: endDate },
              endDate: { gte: startDate },
            },
          ],
        },
      });

      if (overlappingBooking) {
        res.status(400).json({
          success: false,
          message: 'Facility is already booked for the selected dates'
        });
        return;
      }
    }

    const updatedBooking = await updateBooking(BigInt(bookingId), bookingData);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });

  } catch (error) {
    if (error instanceof BaseError) {
          res.status(error.statusCode).json(error.toJSON());
        } else {
          res.status(500).json({
            success: false,
            message: 'Failed to update booking',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
  }
};