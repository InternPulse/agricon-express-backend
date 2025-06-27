import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/errors";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getFacilityBookings,
  getFarmerBookings,
  updateBookingStatus,
} from "../services/booking.service";
import { BookingStatus, CreateBookingParams } from "../types/types";
import { StatusCodes } from "http-status-codes";

export const createBookingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookingData: CreateBookingParams = {
      facilityId: req.body.facilityId,
      farmerId: req.body.farmerId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      amount: req.body.amount,
    };

    const booking = await createBooking(bookingData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
       message: error instanceof Error ? error.message : String(error),
    })
  }
};

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

export const listFarmerBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Famer Booking hit");
  try {
    // const farmerId = BigInt(req.currentUser.id);
    const farmerId = req.currentUser.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    console.log("FamerId", farmerId);
    console.log("page", page);
    console.log("FamerId", limit);

    const farmerBookings = await getFarmerBookings(farmerId, page, limit);
    console.log(farmerBookings);
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
    res.status(500).json({
      success: false,
      message: "Cannot get farmer Bookings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// YET TO FIX
export const listFacilityBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Operator Bookings hit");
  try {
    const operatorId = BigInt(req.currentUser.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    console.log("FamerId", operatorId);
    console.log("page", page);
    console.log("FamerId", limit);

    const bookings = await getFacilityBookings(BigInt(operatorId), page, limit);
    console.log(bookings);

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
    res.status(500).json({
      success: false,
      message: "Cannot get Operator Bookings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
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
      res.status(404).json({
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
      res.status(500).json({
        success: false,
        message: "Unable to fetch booking",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
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
      BigInt(bookingId),
      BookingStatus.INACTIVE
    );

    res.status(200).json({
      status: "success",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
