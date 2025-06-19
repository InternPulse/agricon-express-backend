import prisma from "../database";
import { NotFoundError } from "../errors/errors";

export class BookingService {
  async getAllBookings() {
    const bookings = await prisma.booking.findMany({
      include: {
        facility: true,
        farmer: true,
      },
      orderBy: {
        reservedAt: "desc",
      },
    });

    if (!bookings || bookings.length === 0) {
      throw new NotFoundError({
        message: "No bookings found",
        from: "BookingService",
      });
    }
    return bookings;
  }
}
