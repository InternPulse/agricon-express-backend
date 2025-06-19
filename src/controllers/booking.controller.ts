import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { BaseError } from "../errors/errors";

const bookingService = new BookingService();

export const listBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings();
    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    if (error instanceof BaseError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    // Fallback for unknown errors
    console.error("Unhandled error:", error);
    return res.status(500).json({
      message: "Unexpected server error",
      from: "BookingController",
    });
  }
};
