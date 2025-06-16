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

export const listFarmerBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.currentUser.id;
    
    console.log('=== LIST FARMER BOOKINGS DEBUG ===');
    console.log('FarmerId from auth:', farmerId);
    console.log('===============================');

    // MOCK BOOKING DATA - Replace with actual database query
    const mockBookings = [
      { 
        id: 'booking-1', 
        farmerId: 'owner-1', 
        facilityId: 'facility-1', 
        facilityName: 'Storage Warehouse A',
        amount: 150.00,
        startDate: new Date('2025-06-20T09:00:00Z'),
        endDate: new Date('2025-06-20T17:00:00Z'),
        status: 'confirmed',
        active: true,
        createdAt: new Date('2025-06-15T10:00:00Z'),
        updatedAt: new Date('2025-06-15T10:00:00Z')
      },
      { 
        id: 'booking-2', 
        farmerId: 'owner-1', 
        facilityId: 'facility-2', 
        facilityName: 'Cold Storage Unit B',
        amount: 200.50,
        startDate: new Date('2025-06-25T08:00:00Z'),
        endDate: new Date('2025-06-25T18:00:00Z'),
        status: 'pending',
        active: true,
        createdAt: new Date('2025-06-16T09:30:00Z'),
        updatedAt: new Date('2025-06-16T09:30:00Z')
      },
      { 
        id: 'booking-3', 
        farmerId: 'farmer-1', 
        facilityId: 'facility-3', 
        facilityName: 'Processing Center C',
        amount: 300.00,
        startDate: new Date('2025-07-01T07:00:00Z'),
        endDate: new Date('2025-07-01T19:00:00Z'),
        status: 'confirmed',
        active: true,
        createdAt: new Date('2025-06-14T14:20:00Z'),
        updatedAt: new Date('2025-06-14T14:20:00Z')
      },
      { 
        id: 'booking-4', 
        farmerId: 'owner-1', 
        facilityId: 'facility-1', 
        facilityName: 'Storage Warehouse A',
        amount: 175.25,
        startDate: new Date('2025-06-30T10:00:00Z'),
        endDate: new Date('2025-06-30T16:00:00Z'),
        status: 'cancelled',
        active: false,
        createdAt: new Date('2025-06-10T11:15:00Z'),
        updatedAt: new Date('2025-06-12T13:45:00Z')
      },
      { 
        id: 'booking-5', 
        farmerId: "farmer-1", 
        facilityId: 'facility-5', 
        facilityName: 'Cold Storage Unit C',
        amount: 500.50,
        startDate: new Date('2025-07-01T07:00:00Z'),
        endDate: new Date('2025-07-01T19:00:00Z'),
        status: 'pending',
        active: true,
        createdAt: new Date('2025-06-14T14:20:00Z'),
        updatedAt: new Date('2025-06-14T14:20:00Z')
      },

    ];

    // Filter bookings for the current farmer
    const farmerBookings = mockBookings.filter(booking => booking.farmerId === farmerId);
    
    console.log(`Found ${farmerBookings.length} bookings for farmer ${farmerId}`);

    // Optional: Add query parameters for filtering
    const { status, active, limit, offset } = req.query;
    
    let filteredBookings = farmerBookings;
    
    // Filter by status if provided
    if (status && typeof status === 'string') {
      filteredBookings = filteredBookings.filter(booking => 
        booking.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Filter by active status if provided
    if (active !== undefined) {
      const isActive = active === 'true';
      filteredBookings = filteredBookings.filter(booking => booking.active === isActive);
    }
    
    // Apply pagination if provided
    const limitNum = limit ? parseInt(limit as string, 10) : undefined;
    const offsetNum = offset ? parseInt(offset as string, 10) : 0;
    
    if (limitNum) {
      filteredBookings = filteredBookings.slice(offsetNum, offsetNum + limitNum);
    }
    
    // In real implementation, this would be:
    // const bookings = await prisma.booking.findMany({
    //   where: { farmerId },
    //   include: { facility: true },
    //   orderBy: { createdAt: 'desc' }
    // });

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
    console.error('List farmer bookings error:', error);
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