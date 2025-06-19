import { prisma } from "../../config/config.db";
import { BadRequestError, NotFoundError } from "../../errors/errors";
import { FacilityUpdateData } from "../../types/types";

export const get = async (facilityId: bigint) => {
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId }
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  } catch {
    throw new BadRequestError({message: `Error updating facility with ID ${facilityId}`, from: "update()"});
  }
}