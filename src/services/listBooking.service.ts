import { prisma } from "../prisma/prisma.client";
import { NotFoundError } from "../errors/errors";
import { UserRole } from "../types/types";

export class BookingService {
  async getAllBookings(
    user: { id: string; role: UserRole },
    limit = 10,
    offset = 0
  ) {
    if (user.role === UserRole.ADMIN) {
      const bookings = await prisma.booking.findMany({
        take: limit,
        skip: offset,
        include: {
          facility: true,
          farmer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return bookings;
    }

    if (user.role === UserRole.OPERATOR) {
      const facilities = await prisma.facility.findMany({
        where: {
          operatorId: Number(user.id),
        },
        select: { id: true },
      });

      const facilityIds = facilities.map((f) => f.id);

      const bookings = await prisma.booking.findMany({
        where: {
          facilityId: { in: facilityIds },
        },
        take: limit,
        skip: offset,
        include: {
          facility: true,
          farmer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return bookings;
    }

    throw new NotFoundError({
      message: "Unauthorized to view bookings",
      from: "BookingService",
    });
  }
}
