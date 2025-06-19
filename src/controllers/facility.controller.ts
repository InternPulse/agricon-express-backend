import { NextFunction, Request, Response } from "express";
import { create, get, getAll, update, deleteFacility} from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";

export const addFacility = async (req: Request, res: Response, next: NextFunction) => {
 try {
   const facility = await create(req.body);
    res.status(StatusCodes.CREATED).json({
    message: "Facility created successfully",
    data: facility
  });
 } catch (error) {
    next(error);
 }
}

export const getFacility = async (req: Request, res: Response) => {
  const facilityId = BigInt(req.params.facilityId);
  const facility = await get(facilityId);

  res.status(StatusCodes.OK).json({
    message: "Facility fetch successful", 
    data: facility});
}

export const updateFacility = async (req: Request, res: Response) => {
  const facilityId = BigInt(req.params.facilityId);
  const facility = await update(facilityId, req.body);

  res.status(StatusCodes.OK).json({
    message: "Facility update successful", 
    data: facility
  });
};

export const getAllFacility = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const facilities = await getAll();
    res.status(StatusCodes.OK).json({
    success:true,
    message: "Facility(s) fetch successful",
    data: facilities});
  } catch (error) {
    next(error);
  }
}


export const removeFacility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const facilityId = BigInt(req.params.facilityId);
    const deleted = await deleteFacility(facilityId);
    res.status(StatusCodes.OK).json({
      message: "Facility deleted successfully",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};
