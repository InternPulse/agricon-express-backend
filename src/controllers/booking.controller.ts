import { NextFunction, Request, Response } from "express";
import {NotFoundError } from "../errors/errors";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getFacilityBookings,
  getFarmerBookings,
  updateBookingStatus,
  approveOrRejectBooking,
} from "../services/db/booking.service";
import { BookingStatus, CreateBookingParams } from "../types/types";
import { StatusCodes } from "http-status-codes";
import { createNotification } from "../services/db/notification.service";
import { prisma } from "../config/config.db";

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
    console.log(`Deleting booking with ID: ${bookingId}`);
    await deleteBooking(BigInt(bookingId));
    await createNotification({
      userId: req.currentUser.id,
      title: "Booking Notification",
      message: `Your Booking with ID: ${bookingId} was deleted successfully`,
    });

    res.status(200).json({
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
    const userId = req.currentUser.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const farmerBookings = await getFarmerBookings(userId, page, limit);

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
    const operator = await prisma.operator.findUnique({
      where: { user_id: req.currentUser.id },
    });

    if (!operator) {
      throw new NotFoundError({
        message: "Operator not found",
        from: "listFacilityBookings()",
      });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const bookings = await getFacilityBookings(
      BigInt(operator.id),
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
    console.log("Booking after expiration: ", booking);

    await createNotification({
      userId: req.currentUser.id,
      title: "Booking Notification",
      message: `Your Booking with ID: ${booking.id} is expired`,
    });

    res.status(200).json({
      status: "success",
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

    if (typeof approve !== "boolean") {
      res
        .status(400)
        .json({ success: false, message: "Approve must be a boolean" });
    }

    const updatedBooking = await approveOrRejectBooking(
      BigInt(bookingId),
      approve
    );
    await createNotification({
      userId: req.currentUser.id,
      title: "Booking Notification",
      message: `Booking with ID ${bookingId} was ${approve ? "approved" : "rejected"} successfully`,
    });

    res.status(200).json({
      success: true,
      message: `Booking ${approve ? "approved" : "rejected"} successfully`,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};
