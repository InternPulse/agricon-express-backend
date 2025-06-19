import { Request, Response } from "express";
import { BookingService } from "../services/listBooking.service";
import { BaseError } from "../errors/errors";

const bookingService = new BookingService();

export const listBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);

    const bookings = await bookingService.getAllBookings(
      req.currentUser,
      limit,
      offset
    );

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
      pagination: { limit, offset },
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
