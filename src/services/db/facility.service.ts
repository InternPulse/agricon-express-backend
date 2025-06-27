import { Prisma } from "@prisma/client";
import { prisma } from "../../config/config.db";
import { BadRequestError, BaseError, NotFoundError } from "../../errors/errors";
import { FacilityFilterOptions, FacilityUpdateData, GetByOperatorOptions} from "../../types/types";
import { StatusCodes } from "http-status-codes";

export const create = async (data: Prisma.FacilityCreateInput) => {
  try {
    const facility = await prisma.facility.create({
      data
    });
    return facility;
  } catch {
    throw new BadRequestError({message: `Error creating facility`, from: "addFacility()"}); 
  }
};

export const get = async (facilityId: bigint) => {
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: BigInt(facilityId) }
    });


    if (!facility) {
      throw new NotFoundError({message: `Facility with ID ${facilityId} not found`, from: "getFacility()"});
    }
    
    return facility;

  } catch {
    throw new NotFoundError({message: `Facility with ID ${facilityId} not found`, from: "get()"});
  }
};

export const update = async (facilityId: bigint, data: FacilityUpdateData) => {
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: BigInt(facilityId) },
    });

    if (!facility) {
      throw new NotFoundError({
        message: `Facility with ID ${facilityId} not found`,
        from: "update()",
      });
    }

    const updateData = { ...data } as unknown as any;
    if (updateData.type !== undefined) {
      updateData.type = { set: updateData.type };
    }

    const updatedFacility = await prisma.facility.update({
      where: {
        id: BigInt(facilityId),
      },
      data: updateData,
    });

    return updatedFacility;

  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    throw new BadRequestError({
      message: `Error updating facility with ID ${facilityId}`,
      from: "update()"
    });
  }
};




export const getAll = async () => {
  try {
    const facilities = await prisma.facility.findMany();
    if (!facilities) {
      throw new NotFoundError({message: `No facility found`, from: "getAllFacility()"});
    }
    return facilities;

  } catch {
    throw new BadRequestError({message: `Error getting all facility`, from: "getAll()"});
  }
}


export const deleteFacility = async (facilityId: bigint) => {
  try {
    const deletedFacility = await prisma.facility.delete({
      where: {
        id: facilityId,
      },
    });
    return deletedFacility;
  } catch {
    throw new BadRequestError({
      message: `Error deleting facility with ID ${facilityId}`,
      from: "deleteFacility()",
    });
  }
};


export const getAllFacilities = async (filters: FacilityFilterOptions) => {
  try {
    const { page, limit, location, type, available, minPrice, maxPrice } = filters;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (location) {
      where.OR = [
        { location: { contains: location, mode: "insensitive" } },
        { address: { contains: location, mode: "insensitive" } }
      ];
    }

    if (type) where.type = type.toUpperCase();
    if (available !== undefined) where.available = available;
    if (minPrice !== undefined) where.pricePerDay = { gte: minPrice };
    if (maxPrice !== undefined) {
      where.pricePerDay = {
        ...(where.pricePerDay || {}),
        lte: maxPrice
      };
    }

    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.facility.count({ where })
    ]);

    return {
      facilities,
      pagination: {
        page,
        limit,
        total
      },
      filtersApplied: { location, type, available, minPrice, maxPrice }
    };
  } catch (error) {
    console.log(error);
    throw new BadRequestError({
      message: 'Error fetching all facilities',
      from: "getAllFacilities()",
    });
  }
};

export const getFacilitiesByOperator = async (options: GetByOperatorOptions) => {
  const { operatorId, page, limit } = options;
  const offset = (page - 1) * limit;

  try {
    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
        where: { operatorId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.facility.count({ where: { operatorId } })
    ]);

    return {
      facilities,
      pagination: {
        page,
        limit,
        total
      }
    };
  } catch (err) {
    console.log(err);
    throw new BaseError("Failed to fetch facilities by operator", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateAvailableFacility = async (facilityId: bigint ) => {
//Counts confirmed booking for the facility  
  const confirmedBookingsCount = await prisma.booking.count({
    where: {
      facilityId: facilityId,
      active: true,
    },
  });

// Fetch total capacity from facility
  const facilityCapacity = await prisma.facility.findUnique({
    where: { id: facilityId },
    select: { capacity: true },
  });

  if (!facilityCapacity) {
    throw new Error(`Facility with ID ${facilityId} not found.`);
  };

//Update Facility with available facility
  const newAvailableCapacity = facilityCapacity.capacity - confirmedBookingsCount;

  await prisma.facility.update({
    where: { id: facilityId },
    data: { capacity: newAvailableCapacity },
  });
};