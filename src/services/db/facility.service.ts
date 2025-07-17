import { Prisma } from "@prisma/client";
import { prisma } from "../../config/config.db";
import { BadRequestError, NotFoundError } from "../../errors/errors";
import { FacilityFilterOptions, FacilityUpdateData, GetByOperatorOptions} from "../../types/types";

export const createFacility = async (data: Prisma.FacilityCreateInput) => {
  try {
    const facility = await prisma.facility.create({
      data
    });
    return facility;
  } catch(error) {
    throw new BadRequestError({
      message: `Error creating facility`, 
      from: "addFacility()",
      cause: error
    }); 
  }
};
 

export const getFacilityById = async (facilityId: bigint) => {
const facility = await prisma.facility.findUnique({
    where: {
      id: facilityId
    }
  });

  if (!facility) {
    throw new NotFoundError({
      message: "Facility not found",
      from: "getFacilityById",
    });
  };

  return facility;
};

export const updateFacilityById = async (
  facilityId: bigint,
  data: FacilityUpdateData
) => {
  try {
    const updateData = { ...data } as any;
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
    throw new BadRequestError({
      message: `Error updating facility with ID ${facilityId}`,
      from: "updateFacilityById()",
      cause: error,
    });
  }
};


export const deleteFacilityById = async (facilityId: bigint) => {
  try {
    const deleted = await prisma.facility.delete({
      where: {
        id: facilityId,
      },
    });

    return deleted;
  } catch (error) {
    throw new BadRequestError({
      message: `Error deleting facility with ID ${facilityId}`,
      from: "deleteFacilityById()",
      cause: error,
    });
  }
};


export const getAllFacilities = async (filters: FacilityFilterOptions) => {
  try {
    const { page, limit, location, type, available, minPrice, maxPrice} = filters;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (location) {
      where.location = { contains: location, mode: "insensitive" }
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
    throw new BadRequestError({
      message: `Error fetching all facilities`,
      from: "getAllFacilities()",
      cause: error
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
  } catch (error) {
     throw new BadRequestError({
      message: `Error fetching all facilities by operator`,
      from: "getAllFacilitiesByOperator()",
      cause: error
    });
  }
};


export const updateFacilityImage = async(facilityId: bigint, facilityImage: string) =>{
  try {
    const facility = await prisma.facility.update({
      where: {id: facilityId},
      data: {
        facilityImage: {
          push: [facilityImage],
      }
    }
    })
    return facility;
  } catch (error) {
    throw new BadRequestError({
      message: 'Error updating facility image',
      from: 'updateFacilityImage()',
      cause: error
    })
  }
}

export const updateFacilityCapacity = async (facilityId: bigint, newCapacity: number) => {
    const updatedFacility = await prisma.facility.update({
      where: { id: facilityId },
      data: { capacity: newCapacity },
    });
    return updatedFacility;
};

