import { Request, Response } from 'express';
import { BaseError } from '../errors/errors';
import { prisma } from '../config/config.db';
import { updateBooking } from '../services/booking.service';

export interface UpdateBookingRequest {
  startDate?: Date;
  endDate?: Date;
  amount?: number;
  paid?: boolean;
  active?: boolean;
}

export const updateBookingHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    if (!req.currentUser || !req.currentUser.id) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const bookingData: UpdateBookingRequest = {
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      amount: req.body.amount,
      paid: req.body.paid,
      active: req.body.active,
    };

    // Validate dates if both are provided
    if (bookingData.startDate && bookingData.endDate && bookingData.startDate >= bookingData.endDate) {
      res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
      return;
    }

    // Check if booking exists and belongs to the user
    const existingBooking = await prisma.booking.findUnique({
      where: { id: BigInt(bookingId) },
      include: { farmer: true }
    });

    if (!existingBooking) {
        console.log("Booking does not exist")
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

    // If dates are being updated, check for facility availability
    if (bookingData.startDate || bookingData.endDate) {
      const startDate = bookingData.startDate || existingBooking.startDate;
      const endDate = bookingData.endDate || existingBooking.endDate;

      const overlappingBooking = await prisma.booking.findFirst({
        where: {
          facilityId: existingBooking.facilityId,
          id: { not: BigInt(bookingId) }, 
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