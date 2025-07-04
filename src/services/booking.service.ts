import { BookingStatus, CreateBookingParams } from "../types/types";
import {
  PrismaClient,
  Booking as PrismaBooking,
  Facility,
  Farmer,
} from "@prisma/client";

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
  if (!data.farmerId) {
    errors.push({ field: "farmerId", message: "Farmer ID is required." });
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
  if (data.amount !== undefined && data.amount < 0) {
    errors.push({ field: "amount", message: "Amount cannot be negative." });
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

// export const createBooking = async (data: CreateBookingParams) => {
//   validateBookingRequest(data);
//   try {
//     const facility = await prisma.facility.findUnique({
//       where: { id: BigInt(data.facilityId) },
//     });

//     if (!facility) {
//       throw { status: "Failed", message: "Facility not found" };
//     }
//     if (!facility.available) {
//       throw {
//         status: "Failed",
//         message: "Facility is not available for booking",
//       };
//     }

//     const farmer = await prisma.farmer.findUnique({
//       where: { id: BigInt(data.farmerId) },
//     });

//     if (!farmer) {
//       throw { name: "NotFoundError", message: "Farmer not found" };
//     }

//     const overlappingBookings = await prisma.booking.count({
//       where: {
//         facilityId: BigInt(data.facilityId),
//         farmerId: BigInt(data.farmerId),
//         active: true,
//         startDate: { lt: data.endDate },
//         endDate: { gt: data.startDate },
//       },
//     });

//     if (overlappingBookings > 0) {
//       throw {
//         name: "ConflictError",
//         message: "Facility already booked for these dates",
//       };
//     }

//     const amount =
//       data.amount ??
//       calculateBookingAmount(
//         facility.pricePerDay,
//         data.startDate,
//         data.endDate
//       );

//       return await prisma.booking.create(
//         data
//       )

//     // return prisma.booking.create({
//     //   data: {
//     //     facilityId: BigInt(data.facilityId),
//     //     farmerId: BigInt(data.farmerId),
//     //     startDate: data.startDate,
//     //     endDate: data.endDate,
//     //     amount,
//     //     paid: false,
//     //     active: true,
//     //   },
//     // });
//   } catch (error) {
//     console.log("Failed to create booking", error);
//     // throw error;
//   }
// };

// Update booking

export const createBooking = async (data: CreateBookingParams) => {
  validateBookingRequest(data);
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: BigInt(data.facilityId) },
    });

    if (!facility) {
      throw { status: "Failed", message: "Facility not found" };
    }
    if (!facility.available) {
      throw {
        status: "Failed",
        message: "Facility is not available for booking",
      };
    }

    const farmer = await prisma.farmer.findUnique({
      where: { id: BigInt(data.farmerId) },
    });

    if (!farmer) {
      throw { name: "NotFoundError", message: "Farmer not found" };
    }

    const overlappingBookings = await prisma.booking.count({
      where: {
        facilityId: BigInt(data.facilityId),
        farmerId: BigInt(data.farmerId),
        active: true,
        startDate: { lt: data.endDate },
        endDate: { gt: data.startDate },
      },
    });

    if (overlappingBookings > 0) {
      throw {
        name: "ConflictError",
        message: "Facility already booked for these dates",
      };
    }

    const amount =
      data.amount ??
      calculateBookingAmount(
        facility.pricePerDay,
        data.startDate,
        data.endDate
      );

    const bookingData = {
      farmerId: data.farmerId,
      facilityId: data.facilityId,
      startDate: data.startDate,
      endDate: data.endDate,
      amount,
    };

    return await prisma.booking.create({
      data: bookingData,
    });
  } catch (error) {
    console.log("Failed to create booking", error);
    throw error;
  }
};

export const updateBooking = async (
  id: bigint,
  data: {
    startDate?: Date;
    endDate?: Date;
    amount?: number;
    paid?: boolean;
    active?: boolean;
  }
): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id: Number(id) },
    data: {
      startDate: data.startDate,
      endDate: data.endDate,
      amount: data.amount,
      paid: data.paid,
      active: data.active,
    },
    include: {
      facility: true,
      farmer: true,
    },
  });
};

export const getBookingById = async (id: bigint): Promise<Booking | null> => {
  return await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: {
      facility: true,
      farmer: true,
    },
  });
};

export const deleteBooking = async (id: bigint): Promise<void> => {
  await prisma.booking.delete({
    where: { id: Number(id) },
  });
};

export const getFarmerBookings = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<Booking[]> => {
  const skip = (page - 1) * limit;
  return await prisma.booking.findMany({
    where: {
      farmer: {
        user_id: userId,
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

export const updateBookingStatus = async (
  id: bigint,
  status: BookingStatus
): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id: Number(id) },
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
  bookingId: bigint,
  approve: boolean
): Promise<Booking> => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return prisma.booking.update({
    where: { id: Number(bookingId) },
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
