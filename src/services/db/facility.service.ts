import { Prisma } from "@prisma/client";
import { prisma } from "../../config/config.db";
import { BadRequestError, NotFoundError } from "../../errors/errors";
import { FacilityUpdateData} from "../../types/types";

export const create = async (data: Prisma.FacilityCreateInput) => {
  try {
    const facility = await prisma.facility.create({
      data
    });
    return facility;
  } catch (error) {
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
}

export const update = async (facilityId: bigint, data: FacilityUpdateData) => {
  try {
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

  } catch {
    throw new BadRequestError({message: `Error updating facility with ID ${facilityId}`, from: "update()"});
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
  } catch (error) {
    throw new BadRequestError({
      message: `Error deleting facility with ID ${facilityId}`,
      from: "deleteFacility()",
    });
  }
};
