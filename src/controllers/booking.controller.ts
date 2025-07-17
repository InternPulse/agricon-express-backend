import { NextFunction, Request, Response } from "express";
import {NotFoundError, BadRequestError } from "../errors/errors";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getFacilityBookings,
  getFarmerBookings,
  updateBookingStatus,
  approveOrRejectBooking,
  totalFacilityBooked,
  updateBooking
} from "../services/db/booking.service";
import { BookingStatus, CreateBookingParams } from "../types/types";
import { StatusCodes } from "http-status-codes";
import { createNotification } from "../services/db/notification.service";
import { prisma } from "../config/config.db";
import { booking_status } from "@prisma/client";



export const createBookingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookingData: CreateBookingParams = {
      facilityId: req.body.facilityId,
      farmerId: req.currentUser.farmerId!,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    };

    const booking = await createBooking(bookingData);
    if (booking) {
      await createNotification({
        userId: req.currentUser.id,
        title: "Booking Notification",
        message: `Your Booking with ID: ${booking.id} was reserved successfully`,
      });
    }
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBookingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const farmerId = req.farmer.id; // from isAuthorizedFarmer middleware 

    await deleteBooking(farmerId, Number(bookingId));
    await createNotification({
      userId: req.currentUser.id,
      title: "Booking Notification",
      message: `Your Booking with ID: ${bookingId} was deleted successfully`,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

export const listFarmerBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const farmerId = req.farmer.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const farmerBookings = await getFarmerBookings(farmerId, page, limit);

    res.status(200).json({
      success: true,
      data: farmerBookings,
      pagination: {
        currentPage: page,
        limit: limit,
        total: farmerBookings.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// YET TO FIX
export const listAllFacilitiesBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const operatorId = req.operator.id; // from isAuthorisedOperator middleware

    if (!operatorId) {
      throw new NotFoundError({
        message: "Operator not found",
        from: "listFacilityBookings()",
      });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const bookings = await getFacilityBookings(
     operatorId,
      page,
      limit
    );

    res.status(200).json({
      status: "success",
      data: bookings,
      pagination: {
        page,
        limit,
        total: bookings.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const fetchBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const booking = await getBookingById(BigInt(bookingId));

    if (!booking) {
      throw new NotFoundError({
        message: "Booking not found",
        from: "fetchBooking()",
      });
    };

    res.status(StatusCodes.OK).json({
      message: "Booking retrieved successfully",
      data: booking,
    });

  } catch (error) {
    next(error);
  }
};

export const expireBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId } = req.params;

    const booking = await updateBookingStatus(
      Number(bookingId),
      BookingStatus.INACTIVE
    );

    await createNotification({
      userId: req.currentUser.id,
      title: "Booking Notification",
      message: `Your Booking with ID: ${booking.id} is expired`,
    });

    res.status(StatusCodes.OK).json({
      message: 'Booking Expired.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const approveOrRejectBookingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { approve } = req.body;

    const facility = req.facility

    if (typeof approve !== "boolean") {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false, 
        message: "Approve must be a boolean"
      });
    };

    const updatedBooking = await approveOrRejectBooking(
      facility.id,
      BigInt(bookingId),
      approve
    );

    await createNotification({
      userId: req.currentUser.id,
      title: "Booking Notification",
      message: `Booking with ID ${bookingId} was ${approve ? "approved" : "rejected"} successfully`,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Booking ${approve ? "approved" : "rejected"} successfully`,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const getTotalApprovedBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
   const operatorId = req.operator.id;
    const operator = await prisma.operator.findUnique({
      where: { id: operatorId},
    });

    if (!operator) {
       throw new NotFoundError({
          message: "Operator not found",
          from: "getAllFacility",
        });
    }

    const totalApproved = await totalFacilityBooked(
      operatorId,
      booking_status.CONFIRMED
    );

    res.status(200).json({
      success: true,
      totalApprovedBookings: totalApproved,
    });
  } catch (error) {
    next(error);
  }
};


export interface UpdateBookingRequest {
  startDate?: Date;
  endDate?: Date;
  facilityId?: bigint;
}


export const updateBookingHandler = async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const { bookingId } = req.params;
    const farmerId = req.farmer.id; // from isAuthorizedOperator middleware

    const bookingData: UpdateBookingRequest = {
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      facilityId: req.body.facilityId ? BigInt(req.body.facilityId) : undefined,
    };

    if (bookingData.startDate && bookingData.endDate && bookingData.startDate >= bookingData.endDate) {
      throw new BadRequestError({
        message: 'End date must be after start date',
        from: 'updateBookingHandler()'
      });
    };

    const existingBooking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { farmer: true }
    });

    if (!existingBooking) {
      throw new NotFoundError({
        message: 'Booking does not exist',
        from: 'updateBookingHandler()'
      });
    };
    
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
       throw new NotFoundError({
        message: 'Facility already booked for the selected date',
        from: 'updateBookingHandler()'
      });
      }
    };


    const updatedBooking = await updateBooking(BigInt(bookingId), farmerId, bookingData);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });

  } catch (error) {
    next(error)
  }
};