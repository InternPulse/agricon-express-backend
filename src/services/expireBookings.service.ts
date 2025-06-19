import { prisma } from "../prisma/client";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { UserRole } from "../types/types";

export class BookingExpiryService {
  async expireBooking(bookingId: string, user: { id: string; role: UserRole }) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { facility: true },
    });

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

    // If operator: must only expire their own facility's bookings
    if (
      user.role === UserRole.OPERATOR &&
      booking.facility.operatorId !== user.id
    ) {
      throw new BadRequestError({
        message: "Unauthorized to expire this booking",
        from: "BookingExpiryService",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { active: false },
    });

    return updatedBooking;
  }
}
