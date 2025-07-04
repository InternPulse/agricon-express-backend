import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/config.db";
import { BadRequestError, NotFoundError } from "../errors/errors";

export const preventDateUpdateIfPaid = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { bookingId } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
    select: { paid: true }
  });

  if (!booking) {
    throw new NotFoundError({
      message: `Booking with ID ${bookingId} not found`,
      from: "preventDateUpdateIfPaid()"
    });
  }

  if (booking.paid) {
    throw new BadRequestError({
      message: `Cannot change booking dates after payment is completed`,
      from: "preventDateUpdateIfPaid()"
    });
  };

  next();
};
