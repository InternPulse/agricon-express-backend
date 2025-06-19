import { BadRequestError } from "../../errors/errors";
import prisma from "../../database";
import { FacilityUpdateData } from "../../types/types";

export const get = async (facilityId: string) => {
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId }
    });
    if (!facility) {
      throw new BadRequestError({message: `Facility with ID ${facilityId} not found`, from: "getFacility()"});
    }
    return facility;
   
  } catch (error) {
    throw new BadRequestError({message: `Error fetching facility with ID ${facilityId}: ${error}`, from: "get()"});
  }
}

export const update = async (facilityId: string, data: FacilityUpdateData) => {
  try {
  const updateData = { ...data } as unknown as any;
  if (updateData.type !== undefined) {
    updateData.type = { set: updateData.type };
  }

  const updatedFacility = await prisma.facility.update({
    where: {
      id: facilityId,
    },
    data: updateData,
  });

  return updatedFacility;
   
  } catch (error) {
    throw new BadRequestError({message: `Error updating facility with ID ${facilityId}: ${error}`, from: "update()"});
  }
};

// NEW: Delete facility function
export const remove = async (facilityId: string) => {
  try {
    // First check if facility has active bookings
    const activeBookings = await prisma.booking.findMany({
      where: {
        facilityId: facilityId,
        active: true
      }
    });

    if (activeBookings.length > 0) {
      throw new BadRequestError({
        message: `Cannot delete facility with active bookings. Found ${activeBookings.length} active booking(s)`,
        from: "remove()"
      });
    }

    // Delete the facility
    const deletedFacility = await prisma.facility.delete({
      where: {
        id: facilityId
      }
    });

    return deletedFacility;
    
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError({
      message: `Error deleting facility with ID ${facilityId}: ${error}`,
      from: "remove()"
    });
  }
};

// NEW: Get facility status function
export const getStatus = async (facilityId: string) => {
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: {
        bookings: {
          where: {
            active: true
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            farmer: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    if (!facility) {
      throw new BadRequestError({
        message: `Facility with ID ${facilityId} not found`,
        from: "getStatus()"
      });
    }

    // Calculate status based on availability and active bookings
    const currentDate = new Date();
    const activeBookings = facility.bookings.filter((booking: {
      id: string;
      startDate: Date;
      endDate: Date;
      farmer: { id: string };
    }) => 
      new Date(booking.startDate) <= currentDate && 
      new Date(booking.endDate) >= currentDate
    );

    const status = {
      id: facility.id,
      available: facility.available,
      capacity: facility.capacity,
      currentOccupancy: activeBookings.length,
      utilizationRate: (activeBookings.length / facility.capacity) * 100,
      status: facility.available ? (activeBookings.length >= facility.capacity ? 'FULLY_BOOKED' : 'AVAILABLE') : 'UNAVAILABLE',
      activeBookings: activeBookings.length,
      nextAvailableSlot: facility.available && activeBookings.length < facility.capacity ? 'IMMEDIATE' : 'UNKNOWN'
    };

    return status;
    
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError({
      message: `Error fetching facility status for ID ${facilityId}: ${error}`,
      from: "getStatus()"
    });
  }
};