import { PrismaClient, Prisma } from "@prisma/client";
import { CreateBookingRequest } from "../controllers/createbooking.controller";

const prisma = new PrismaClient();

// Reusable validation logic (from first approach)
const validateBookingRequest = (data: CreateBookingRequest) => {
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

export const createBooking = async (data: CreateBookingRequest) => {
  validateBookingRequest(data);
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: BigInt(data.facilityId) },
    });

    if (!facility) {
      console.log("Facility not found")
      throw { name: "NotFoundError", message: "Facility not found" };
    }
    if (!facility.available) {
      console.log("Facility is not available")
      throw {
        name: "ConflictError",
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
        active: true,
        startDate: { lt: data.endDate },
        endDate: { gt: data.startDate },
      },
    });

    if (overlappingBookings > 0) {
      console.log("Facility is already booked")
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

    return prisma.booking.create({
      data: {
        facility: { connect: { id: BigInt(data.facilityId) } },
        farmer: { connect: { id: BigInt(data.farmerId) } },
        startDate: data.startDate,
        endDate: data.endDate,
        amount,
        paid: false,
        active: false,
      },
      include: { facility: true, farmer: true },
    });
  } catch (error) {
    console.log("Failed to create booking", error);
    throw error;
  }
};
