import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient;
export const createBooking = async (data) => {
    const facility = await prisma.facility.findUnique({
        where: { id: data.facility.connect?.id }
    });
    if (!facility || !facility.available) {
        console.log("Facility unavailabe");
    }
    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.count({
        where: {
            facilityId: data.facility.connect?.id,
            OR: [
                {
                    startDate: { lt: data.endDate },
                    endDate: { gt: data.startDate }
                }
            ]
        }
    });
    if (overlappingBookings > 0) {
        throw new Error('Facility is already booked for the selected time slot');
    }
    const booking = await prisma.booking.create({
        data: {
            ...data,
            paid: false,
            active: false
        }
    });
    return booking;
};
