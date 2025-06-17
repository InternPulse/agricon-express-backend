import { Request, Response } from "express";
import { create, get, update } from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";

export const addFacility = async (req: Request, res: Response) => {
  const facility = await create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Facility created successfully",
    data: facility
  });
}

export const getFacility = async (req: Request, res: Response) => {
  const facilityId = req.params.facilityId;
  const facility = await get(facilityId);

  res.status(StatusCodes.OK).json({message: "Facility fetch successful", facility});
}

export const updateFacility = async (req: Request, res: Response) => {
  const facilityId = req.params.facilityId;
  const facility = await update(facilityId, req.body);

  res.status(StatusCodes.OK).json({message: "Facility update successful", facility});
}