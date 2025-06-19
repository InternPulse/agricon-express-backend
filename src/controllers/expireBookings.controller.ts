import { Request, Response } from "express";
import { BaseError } from "../errors/errors";
import { BookingExpiryService } from "../services/expireBookings.service";

const expiryService = new BookingExpiryService();

export const expireBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const user = req.currentUser;

    const expiredBooking = await expiryService.expireBooking(bookingId, user);

    res.status(200).json({
      success: true,
      message: "Booking marked as expired successfully",
      data: expiredBooking,
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
