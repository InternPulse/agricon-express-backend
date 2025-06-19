import { Request, Response } from "express";
import { BookingService } from "../services/listBooking.service";
import { BaseError } from "../errors/errors";

const bookingService = new BookingService();

export const listBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit = "10", offset = "0" } = req.query;

    const bookings = await bookingService.getAllBookings(
      req.currentUser,
      parseInt(limit as string, 10),
      parseInt(offset as string, 10)
    );

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    if (error instanceof BaseError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      console.error("Unhandled error in listBookings:", error);
      res.status(500).json({
        message: "Unexpected server error",
        from: "BookingController",
      });
    }
  }
};
