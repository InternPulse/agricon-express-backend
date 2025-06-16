import { BadRequestError } from "../../errors/errors";
import prisma from "../../database";

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

export const update = async (facilityId: string, data: any) => {
  try {
    const updatedFacility = await prisma.facility.update({
    where: {
      id: facilityId,
    },
    data,
  });
  
    return updatedFacility;

  } catch (error) {
    throw new BadRequestError({message: `Error updating facility with ID ${facilityId}: ${error}`, from: "update()"});
  }
}