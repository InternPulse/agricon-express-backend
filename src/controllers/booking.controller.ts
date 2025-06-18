import { Request, Response } from 'express';
import prisma from '../database';
import { BaseError, NotFoundError, UnauthorizedError } from '../errors/errors';


const USE_MOCK = process.env.MOCK_MODE === 'true';
console.log("MOCK_MODE:", process.env.MOCK_MODE);


const mockBookings = [
  {
    id: 'booking-1',
    farmerId: 'farmer-1',
    facilityId: 'facility-1',
    amount: 3000,
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  },
  {
    id: 'booking-2',
    farmerId: 'farmer-1',
    facilityId: 'facility-2',
    amount: 5000,
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  },
];

export const fetchBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    //const userId = req.currentUser.id;
    const userId = USE_MOCK ? 'farmer-1' : req.currentUser.id;


    if (USE_MOCK) {
      const userBookings = mockBookings.filter(b => b.farmerId === userId);
      res.status(200).json({ success: true, data: userBookings });
      return
    }

    const bookings = await prisma.booking.findMany({
      where: { farmerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('fetchBookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


export const updateBooking = async (req: Request, res: Response):Promise<void>=> {
  try {
    //const userId = req.currentUser.id;
    const userId = USE_MOCK ? 'farmer-1' : req.currentUser.id;
    const { bookingId } = req.params;
    const { startDate, endDate, amount ,active} = req.body;

    if (USE_MOCK) {
      const booking = mockBookings.find(b => b.id === bookingId);

      if (!booking) {
        throw new NotFoundError({ message: 'Booking not found', from: 'updateBooking' });
      }

      if (booking.farmerId !== userId) {
        throw new UnauthorizedError({ message: 'Unauthorized to update this booking', from: 'updateBooking' });
      }

      booking.startDate = startDate ? new Date(startDate) : booking.startDate;
      booking.endDate = endDate ? new Date(endDate) : booking.endDate;
      booking.amount = amount ?? booking.amount;
      booking.active = typeof active === 'boolean' ? active : booking.active;
      booking.updatedAt = new Date();

     res.status(200).json({
        success: true,
        message: 'Booking updated (mock)',
        data: booking,
      });
      return
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      throw new NotFoundError({ message: 'Booking not found', from: 'updateBooking' });
    }

    if (existingBooking.farmerId !== userId) {
      throw new UnauthorizedError({ message: 'Unauthorized to update this booking', from: 'updateBooking' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        amount,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('updateBooking error:', error);
    if (error instanceof BaseError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update booking',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
};
