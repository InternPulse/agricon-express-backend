import { Request, Response } from "express";
import { get, update } from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";

export const getFacility = async (req: Request, res: Response) => {
  const facilityId = BigInt(req.params.facilityId);
  const facility = await get(facilityId);

  res.status(StatusCodes.OK).json({message: "Facility fetch successful", facility});
}

export const updateFacility = async (req: Request, res: Response) => {
  const facilityId = BigInt(req.params.facilityId);
  const facility = await update(facilityId, req.body);

  res.status(StatusCodes.OK).json({message: "Facility update successful", facility});
}