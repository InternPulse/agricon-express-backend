import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
import { BaseError } from '../errors/errors';
import { mockBookings } from '../data/mockBookings';
import { filterBookings } from '../utils/bookingFilters';

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {

    // MOCK DELETION - Skip actual database deletion
    // In real implementation: await prisma.booking.delete({ where: { id: bookingId } });

    res.status(204).send();
  } catch (error) {
    if (error instanceof BaseError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

export const listFarmerBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.currentUser.id;
    const { status, active, limit, offset } = req.query;

    const filteredBookings = filterBookings(mockBookings, {
      farmerId,
      status: status as string,
      active: active as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : 0
    });

    const farmerBookings = mockBookings.filter(booking => booking.farmerId === farmerId);

    res.status(200).json({
      success: true,
      data: {
        bookings: filteredBookings,
        total: farmerBookings.length,
        filtered: filteredBookings.length,
        farmer: {
          id: farmerId,
          role: req.currentUser.role
        }
      }
    });
  } catch (error) {
    if (error instanceof BaseError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};