import { prisma } from "../prisma/prisma.client";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { UserRole } from "../types/types";
import { Booking, Facility } from "@prisma/client";

export class BookingExpiryService {
  async expireBooking(bookingId: string, user: { id: string; role: UserRole }) {
    const bookingIdAsBigInt = BigInt(bookingId);

    const booking = (await prisma.booking.findUnique({
      where: { id: bookingIdAsBigInt },
      include: { facility: true },
    })) as Booking & { facility: Facility };

    if (!booking) {
      throw new NotFoundError({
        message: "Booking not found",
        from: "BookingExpiryService",
      });
    }

    if (!booking.active) {
      throw new BadRequestError({
        message: "Booking is already inactive",
        from: "BookingExpiryService",
      });
    }

    const now = new Date();
    if (now < booking.endDate) {
      throw new BadRequestError({
        message: "Booking has not expired yet",
        from: "BookingExpiryService",
      });
    }

    if (
      user.role === UserRole.OPERATOR &&
      booking.facility.operatorId !== BigInt(user.id)
    ) {
      throw new BadRequestError({
        message: "Unauthorized to expire this booking",
        from: "BookingExpiryService",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingIdAsBigInt },
      data: { active: false },
    });

    return updatedBooking;
  }
}
