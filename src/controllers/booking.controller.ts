// booking.controller.ts
import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
import { BaseError } from '../errors/errors';
import { mockBookings } from '../data/mockBookings';
import { filterBookings } from '../utils/bookingFilters';

// const prisma = new PrismaClient();

// export const createBooking = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { facilityId, amount, startDate, endDate } = req.body;
//       const farmerId = req.currentUser.id;
  
//       // Validate required fields
//       if (!facilityId || !amount || !startDate || !endDate) {
//         throw new BaseError('Missing required fields', 400);
//       }
  
//       // MOCK FACILITY CHECK - Replace database check with mock data
//       const mockFacilities = [
//         { id: 'facility-1', name: 'Mock Facility 1', available: true },
//         { id: 'facility-2', name: 'Mock Facility 2', available: true },
//         { id: 'facility-3', name: 'Mock Facility 3', available: false },
//       ];
  
//       const facility = mockFacilities.find(f => f.id === facilityId);
  
//       if (!facility) {
//         throw new BaseError('Facility not found', 404);
//       }
  
//       if (!facility.available) {
//         throw new BaseError('Facility is not available', 400);
//       }
  
//       // MOCK BOOKING CREATION - Skip database insert for now
//       const mockBooking = {
//         id: `booking-${Date.now()}`, // Generate a mock ID
//         facilityId,
//         farmerId,
//         amount,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         active: true,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };
  
//       res.status(201).json({
//         success: true,
//         data: mockBooking
//       });
//     } catch (error) {
//       if (error instanceof BaseError) {
//         res.status(error.statusCode).json(error.toJSON());
//       } else {
//         res.status(500).json({
//           success: false,
//           message: 'Internal server error',
//           error: error instanceof Error ? error.message : 'Unknown error'
//         });
//       }
//     }
// };

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