import { Request, Response } from "express";
import { get, update, remove, getStatus } from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";

export const getFacility = async (req: Request, res: Response) => {
  const facilityId = req.params.facilityId;
  const facility = await get(facilityId);
  
  res.status(StatusCodes.OK).json({message: "Facility fetch successful", facility});
}

export const updateFacility = async (req: Request, res: Response) => {
  const facilityId = req.params.facilityId;
  const facility = await update(facilityId, req.body);
  
  res.status(StatusCodes.OK).json({message: "Facility update successful", facility});
};

// Delete facility controller
export const deleteFacility = async (req: Request, res: Response) => {
  const facilityId = req.params.facilityId;
  const deletedFacility = await remove(facilityId);
  
  res.status(StatusCodes.OK).json({
    message: "Facility deleted successfully", 
    facility: deletedFacility
  });
};

// Get facility status controller
export const getFacilityStatus = async (req: Request, res: Response) => {
  const facilityId = req.params.facilityId;
  const status = await getStatus(facilityId);
  
  res.status(StatusCodes.OK).json({
    message: "Facility status fetch successful", 
    status
  });
};