import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/errors";
import {
  BookingService,
  deleteBooking,
  getBookingById,
} from "../services/booking.service";
import { BookingExpiryService } from "../services/bookingExpire.service";
import { mockBookings } from "../data/mockBookings";
import { filterBookings } from "../utils/bookingFilters";

// ======= COMMENTED MOCK CREATE FUNCTION (preserved) =========

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export const createBooking = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { facilityId, amount, startDate, endDate } = req.body;
//     const farmerId = req.currentUser.id;

//     if (!facilityId || !amount || !startDate || !endDate) {
//       throw new BaseError('Missing required fields', 400);
//     }

//     const mockFacilities = [
//       { id: 'facility-1', name: 'Mock Facility 1', available: true },
//       { id: 'facility-2', name: 'Mock Facility 2', available: true },
//       { id: 'facility-3', name: 'Mock Facility 3', available: false },
//     ];

//     const facility = mockFacilities.find(f => f.id === facilityId);

//     if (!facility) throw new BaseError('Facility not found', 404);
//     if (!facility.available) throw new BaseError('Facility is not available', 400);

//     const mockBooking = {
//       id: `booking-${Date.now()}`,
//       facilityId,
//       farmerId,
//       amount,
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       active: true,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     res.status(201).json({ success: true, data: mockBooking });
//   } catch (error) {
//     if (error instanceof BaseError) {
//       res.status(error.statusCode).json(error.toJSON());
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   }
// };

// ============================================================

// Instance of BookingService and BookingExpiryService
const bookingService = new BookingService();
const expiryService = new BookingExpiryService();

//  LIST BOOKINGS (for Admin/Operator)
export const listBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : 0;

    const bookings = await bookingService.getAllBookings(
      req.currentUser,
      limit,
      offset
    );

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: { limit, offset },
    });
  } catch (error) {
    if (error instanceof BaseError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    console.error("Unhandled error:", error);
    res.status(500).json({
      message: "Unexpected server error",
      from: "BookingController",
    });
  }
};

//  LIST BOOKINGS FOR LOGGED-IN FARMER (MOCK)
export const listFarmerBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const farmerId = req.currentUser.id;
    const { status, active, limit, offset } = req.query;

    const filteredBookings = filterBookings(mockBookings, {
      farmerId,
      status: status as string,
      active: active as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : 0,
    });

    const farmerBookings = mockBookings.filter((b) => b.farmerId === farmerId);

    res.status(200).json({
      success: true,
      data: {
        bookings: filteredBookings,
        total: farmerBookings.length,
        filtered: filteredBookings.length,
        farmer: {
          id: farmerId,
          role: req.currentUser.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof BaseError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

//  EXPIRE BOOKING
export const expireBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const user = req.currentUser;

    const expired = await expiryService.expireBooking(bookingId, user);

    res.status(200).json({
      success: true,
      message: "Booking expired successfully",
      data: expired,
    });
  } catch (error) {
    if (error instanceof BaseError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      console.error("Unhandled error:", error);
      res.status(500).json({
        message: "Unexpected server error",
        from: "expireBooking Controller",
      });
    }
  }
};

//  FETCH BOOKING BY ID
export const fetchBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const booking = await getBookingById(BigInt(bookingId));

    if (!booking) {
      return res.status(404).json({
        status: "Failed",
        message: "Booking not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: booking,
    });
  } catch (error) {
    if (error instanceof BaseError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      console.error("Unhandled error:", error);
      res.status(500).json({
        message: "Unexpected server error",
        from: "BookingController",
      });
    }
    next(error);
  }
};

//  DELETE BOOKING HANDLER
export const deleteBookingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params;
    await deleteBooking(BigInt(bookingId));
    res.status(204).send();
  } catch (error) {
    if (error instanceof BaseError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};
