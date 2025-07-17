import { NextFunction, Request, Response } from "express";

// Extend Express Request interface to include decodeuser
declare global {
  namespace Express {
    interface Request {
      decodeuser?: any;
    }
  }
};

import {
  createFacility,
  getFacilityById,
  updateFacilityById,
  deleteFacilityById,
  getAllFacilities,
  getFacilitiesByOperator,
  updateFacilityCapacity,
} from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/errors";
import { PrismaClient } from "@prisma/client";
import { deleteImageFromCloudinary } from "../services/cloudinary.service";
const prisma = new PrismaClient();

export const addFacility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const facility = await createFacility({...req.body, operatorId: req.currentUser.operatorId});

    res.status(StatusCodes.CREATED).json({
      message: "Facility created successfully",
      data: facility,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteFacilityImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { facilityId } = req.params;
    const { imageUrl } = req.body;
    await deleteImageFromCloudinary(imageUrl);

    const facility = await prisma.facility.findUnique({
      where: { id: BigInt(facilityId) },
    });
    if (!facility) {
      throw new NotFoundError({
        message: 'Error deleting facility image',
        from: 'deleteFacilityImage()',
        cause: 'Facility not found'
      });
    }

    const updatedImages = facility.facilityImage.filter(
      (img) => img !== imageUrl
    );

    await prisma.facility.update({
      where: { id: BigInt(facilityId) },
      data: { facilityImage: updatedImages },
    });

    res.status(200).json({
      message: "Image deleted successfully",
    });
    return;

  } catch (error) {
    next(error);
  }
};

export const getFacility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const facilityId = BigInt(req.params.facilityId);
    const facility = await getFacilityById(facilityId );
    res.status(StatusCodes.OK).json({ 
      message: "Facility fetch successful", 
      facility: facility
    });

  } catch(error) {
    next(error);
  }
};

export const updateFacility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const facility = req.facility; // already validated by isFacilityOwner
    const updateData = req.body;

    const updated = await updateFacilityById(facility.id, updateData);

    res.status(StatusCodes.OK).json({
      message: "Facility updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteFacility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const facility = req.facility; // Already validated by isFacilityOwner middleware
    await deleteFacilityById(facility.id);

    res.status(StatusCodes.OK).json({
      message: "Facility deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFacility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 15);

    const filters: {
      page: number;
      limit: number;
      location?: string;
      type?: any;
      minPrice?: number;
      maxPrice?: number;
      available?: boolean;
    } = {
      page,
      limit,
      location: req.query.location as string | undefined,
      available:
        req.query.available === undefined
          ? undefined
          : req.query.available === "true"
            ? true
            : false,
      type: (req.query.type as string | undefined)?.toUpperCase() as any,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    // EXTRA VALIdation for type
    const validTypes = ["DRYER", "STORAGE", "PROCESSING", "OTHER"];
    if (filters.type && !validTypes.includes(filters.type)) {
      throw new BadRequestError({
        message: `Invalid type '${filters.type}'. Must be one of ${validTypes.join(", ")}`,
        from: "getAllFacility",
      });
    };

    const result = await getAllFacilities(filters);

    res.status(StatusCodes.OK).json({
      message: "Facilities fetched successfully",
      ...result,
    });

  } catch (error) {
    next(error);
  }
};


export const getFacilitiesByOperatorController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const operatorId = BigInt(req.operator?.id); // Get from isAuthorisedMiddleware
    if (!operatorId) {
      throw new UnauthorizedError({
        message: "Operator not found",
        from: "getAllFacility",
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const result = await getFacilitiesByOperator({
      operatorId,
      page,
      limit,
    });

    res.status(StatusCodes.OK).json({
      message: "Facilities fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCapacity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const facilityId = BigInt(req.params.facilityId);
  const { capacity } = req.body;
  const parsedCapacity = parseInt(capacity, 10);

  if (!parsedCapacity || isNaN(parsedCapacity) || parsedCapacity < 0) {
   throw new BadRequestError({
      message: "Capacity musst be a positive number",
      from: "updateCapacity",
    });
  }
  try {
    const updatedFacility = await updateFacilityCapacity(
      facilityId,
      parsedCapacity
    );
    res.status(StatusCodes.OK).json({
      message: "Capacity updated successfully",
      data: updatedFacility,
    });
    return;
  } catch (error) {
    next(error);
  }
};
