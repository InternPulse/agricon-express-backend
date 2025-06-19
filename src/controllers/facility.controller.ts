import { Request, Response } from "express";
import { get, update } from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/errors";

export const getFacility = async (req: Request, res: Response) => {
  try {
    const facilityId = BigInt(req.params.facilityId);
    const facility = await get(facilityId);
    res.status(StatusCodes.OK).json({message: "Facility fetch successful", facility: facility});  
  } catch {
     throw new NotFoundError({message: `Facility not found`, from: "getFacility()"});
  }
}

export const updateFacility = async (req: Request, res: Response) => {
  const facilityId = BigInt(req.params.facilityId);
  const facility = await update(facilityId, req.body);

  res.status(StatusCodes.OK).json({message: "Facility update successful", facility});
}