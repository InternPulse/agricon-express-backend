import { BadRequestError, NotFoundError } from "../../errors/errors";
import { BookingStatus, CreateBookingParams } from "../../types/types";
import {
  PrismaClient,
  Booking as PrismaBooking,
  Facility,
  Farmer,
} from "@prisma/client";
import { booking_status } from "@prisma/client";

const prisma = new PrismaClient();

export interface Booking extends PrismaBooking {
  facility: Facility;
  farmer: Farmer;
}

const validateBookingRequest = (data: CreateBookingParams) => {
  const errors: { field: string; message: string }[] = [];

  if (!data.facilityId) {
    errors.push({ field: "facilityId", message: "Facility ID is required." });
  }

  if (data.startDate >= data.endDate) {
    errors.push({
      field: "dateRange",
      message: "Start date must be before end date.",
    });
  }
  if (data.startDate < new Date()) {
    errors.push({
      field: "startDate",
      message: "Start date cannot be in the past.",
    });
  }

  if (errors.length > 0) {
    throw {
      name: "ValidationError",
      message: "Booking validation failed",
      errors,
    };
  }
};

// Calculate cost (from first approach)
const calculateBookingAmount = (
  costPerDay: number,
  startDate: Date,
  endDate: Date
) => {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );
  return costPerDay * days;
};

export const createBooking = async (data: CreateBookingParams) => {
  validateBookingRequest(data);

  try {
    const facility = await prisma.facility.findUnique({
      where: { id: data.facilityId },
    });

    if (!facility) {
      throw new BadRequestError({
        message: "Facility not found",
        from: "Failed",
      });
    }
    if (!facility.available) {
      throw new BadRequestError({
        message: "Facility availability not found",
        from: "Failed",
      });
    }

    const farmer = await prisma.farmer.findUnique({
      where: { id: data.farmerId },
    });

    if (!farmer) {
      throw new NotFoundError({ message: "Farmer not found", from: "Failed" });
    }

    const overlappingBookings = await prisma.booking.count({
      where: {
        facilityId: data.facilityId,
        farmerId: data.farmerId,
        active: true,
        startDate: { lt: data.endDate },
        endDate: { gt: data.startDate },
      },
    });

    if (overlappingBookings > 0) {
      throw new BadRequestError({
        message: "Facility already booked for this date",
        from: "Overlapping bookings: createBookingService()",
      });
    }

    const amount = calculateBookingAmount(
        facility.pricePerDay,
        data.startDate,
        data.endDate
      );

    const bookingData = {
      farmerId: data.farmerId,
      facilityId: data.facilityId,
      startDate: data.startDate,
      endDate: data.endDate,
      amount: amount,
    };

    return await prisma.booking.create({
      data: bookingData,
    });
  } catch (error) {
    throw new BadRequestError({
      message: "Error creating booking",
      from: "createBookingService",
      cause: error,
    });
  }
};

export const updateBooking = async (
  id: bigint,
  farmerId: bigint, 
  data: {
    startDate?: Date;
    endDate?: Date;
    facilityId?: bigint;
  }
): Promise<Booking> => {
  const existing = await prisma.booking.findUnique({
    where: { id: Number(id) },
  });

  if (!existing || BigInt(existing.farmerId) !== BigInt(farmerId)) {
    throw new NotFoundError({
      message: 'Booking not found or not owned by you',
      from: 'updateBooking()',
    });
  };

  return await prisma.booking.update({
    where: { id: Number(id) },
    data: {
      startDate: data.startDate,
      endDate: data.endDate,
      facilityId: data.facilityId,
    },
    include: {
      facility: true,
      farmer: true,
    },
  });
};


export const getBookingById = async (bookingId: bigint): Promise<Booking | null> => {
  return await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
    include: {
      facility: true,
      farmer: true,
    },
  });
};

export const deleteBooking = async (farmerId: bigint, bookingId: number): Promise<void> => {
   const booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          farmerId: farmerId, 
        },
      });

  if (!booking) {
    throw new NotFoundError({
      message: "Booking not found or not authorisedFarmer",
      from: "deleteBooking()",
    });
  }
  await prisma.booking.delete({
    where: { id: Number(bookingId)}
  });
};

export const getFarmerBookings = async (
  farmerId: bigint,
  page: number = 1,
  limit: number = 10
): Promise<Booking[]> => {
  const skip = (page - 1) * limit;
  return await prisma.booking.findMany({
    where: {
      farmer: {
        id: farmerId,
      },
    },
    skip,
    take: limit,
    include: {
      facility: true,
      farmer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getFacilityBookings = async (
  operatorId: bigint,
  page: number = 1,
  limit: number = 10
): Promise<Booking[]> => {
  const skip = (page - 1) * limit;

  return await prisma.booking.findMany({
    where: {
      facility: {
        operatorId: operatorId,
      },
    },
    skip,
    take: limit,
    include: {
      facility: true,
      farmer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const totalFacilityBooked = async (
  operatorId: bigint,
  status: booking_status 
): Promise<number> => {
  return await prisma.booking.count({
    where: {
      status: status,
      paid: true,
      facility: {
        operatorId: operatorId
      }
    }
  });
};


export const updateBookingStatus = async (
  id: number,
  status: BookingStatus
): Promise<Booking> => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
  });

  if (!booking) {
    throw new NotFoundError({
      message: "Booking not found",
      from: "updateBookingStatus()",
    });
  }

  return await prisma.booking.update({
    where: { id: id },
    data: { active: status === BookingStatus.ACTIVE },
    include: {
      facility: true,
      farmer: true,
    },
  });
};

export const expireReservation = async (): Promise<void> => {
  //const expirationTime = new Date(Date.now() - 1 * 60 * 1000); // 1 minute for testing
  const expirationTime = new Date(Date.now() - 2 * 60 * 60 * 1000); //2hrs
  const result = await prisma.booking.updateMany({
    where: {
      paid: false,
      active: true,
      createdAt: {
        lt: expirationTime,
      },
    },
    data: {
      active: false,
      status: "CANCELLED",
    },
  });

  console.log(`Expired ${result.count} unpaid bookings older than 2 hours`);
};

// approve or reject booking
export const approveOrRejectBooking = async (
  facilityId: bigint,
  bookingId: bigint,
  approve: boolean
): Promise<Booking> => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
  });

  if (!booking) {
    throw new NotFoundError({
      message: "Booking not found",
      from: "approveOrRejectBooking()",
    });
  };

    if (booking.facilityId !== facilityId) {
    throw new BadRequestError({
      message: "Operator not authorized to approve/reject this booking",
      from: "approveOrRejectBooking()",
    });
  };

  return prisma.booking.update({
    where: {
      id: Number(bookingId)
    },
    data: {
      approved: approve,
      approvedAt: approve ? new Date() : null,
    },
    include: {
      facility: true,
      farmer: true,
    },
  });
};
