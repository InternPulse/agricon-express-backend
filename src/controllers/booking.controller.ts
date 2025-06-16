// booking.controller.ts
import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
import { BaseError } from '../errors/errors';

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
      const { bookingId } = req.params;
      const farmerId = req.currentUser.id;
      
      console.log('=== DELETE BOOKING DEBUG ===');
      console.log('BookingId from params:', bookingId);
      console.log('FarmerId from auth:', farmerId);
      console.log('=============================');
  
       // Validate bookingId
       if (!bookingId) {
        throw new BaseError('Booking ID is required', 400);
      }
      
      // EXPANDED MOCK BOOKING DATA - More options for testing
      const mockBookings = [
        { id: 'booking-1', farmerId: 'owner-1', facilityId: 'facility-1', active: true },
        { id: 'booking-2', farmerId: 'owner-1', facilityId: 'facility-2', active: true },
        { id: 'booking-3', farmerId: 'farmer-1', facilityId: 'facility-3', active: true },
        { id: 'booking-4', farmerId: farmerId, facilityId: 'facility-1', active: true },
        { id: 'booking-5', farmerId: farmerId, facilityId: 'facility-2', active: true },
      ];
  
      const booking = mockBookings.find(b => b.id === bookingId);
  
      if (!booking) {
        throw new BaseError('Booking not found', 404);
      }
  
      if (booking.farmerId !== farmerId) {
        throw new BaseError('Unauthorized to delete this booking', 403);
      }
  
      // MOCK DELETION - Skip actual database deletion
      // In real implementation: await prisma.booking.delete({ where: { id: bookingId } });
  
      res.status(200).json({
        success: true,
        message: 'Booking deleted successfully',
        data: { 
          bookingId,
          deletedBy: farmerId
        }
      });
    } catch (error) {
      console.error('Delete booking error:', error);
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