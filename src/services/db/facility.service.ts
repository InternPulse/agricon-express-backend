import { BadRequestError } from "../../errors/errors";
import prisma from "../../database";
import { Facility, FacilityUpdateData } from "../../types/types";

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
  // Transform 'type' property if present to match Prisma's update format
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
    throw new BadRequestError({message: `Error updating facility with ID ${facilityId}: ${error}`, from: "update()"});
  }
}