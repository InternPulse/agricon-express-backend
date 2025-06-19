import { NextFunction, Request, Response } from "express";
import { create, get, getAll, update, deleteFacility, getAllFacilities, getFacilitiesByOperator} from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { FacilityFilterOptions } from "../types/types";

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


export const getAllFacilitiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const availableParam = req.query.available;
    let available: boolean | undefined;
    if (availableParam === "true") available = true;
    else if (availableParam === "false") available = false;
    else if (availableParam !== undefined) {
      throw new BadRequestError({
        message: "`available` must be true or false",
        from: "getAllFacilitiesController"
      });
    };
    
const type = req.query.type ? (req.query.type as string).toUpperCase() : undefined;

const filters: FacilityFilterOptions = {
  page,
  limit,
  location: req.query.location as string | undefined,
  type: type as FacilityFilterOptions["type"],
  available,
  minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
  maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
};

    // EXTRA VALIdation for type
    const validTypes = ["DRYER", "STORAGE", "PROCESSING", "OTHER"];
    if (filters.type && !validTypes.includes(filters.type)) {
      throw new BadRequestError({
        message: `Invalid type '${filters.type}'. Must be one of ${validTypes.join(", ")}`,
        from: "getAllFacilitiesController"
      });
    }

    const result = await getAllFacilities(filters);

    res.status(StatusCodes.OK).json({
      message: "Facilities fetched successfully",
      ...result
    });

  } catch (err) {
   next(err)
  }
};


export const getFacilitiesByOperatorController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const operatorIdRaw = req.params.operatorId;

    let operatorId: bigint;
    try {
      operatorId = BigInt(operatorIdRaw);
    } catch {
      throw new BadRequestError({
        message: "Invalid operator ID",
        from: "getFacilitiesByOperatorController"
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const result = await getFacilitiesByOperator({
      operatorId,
      page,
      limit
    });

    res.status(StatusCodes.OK).json({
      message: "Facilities fetched successfully",
      ...result
    });

  } catch (err) {
   next(err)
  }
};
