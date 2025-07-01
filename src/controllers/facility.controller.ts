import { NextFunction, Request, Response } from "express";
import { create, get, update, deleteFacility, getAllFacilities, getFacilitiesByOperator, updateFacilityCapacity, uploadImageToCloudinary, updateFacilityImage, deleteImageFromCloudinary} from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

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


export const uploadFacilityImage = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {facilityId} = req.params;
    if(!req.file){
      throw new BadRequestError({
        message: "No image file provided",
        from: "UploadFacilityImage()",
      })
    }

    const facility = await get(BigInt(facilityId));
    if(!facility){
      throw new NotFoundError({
        message: "Facility not found",
        from: "UploadFacilityImage"
      })
    }

    const imageUrl = await uploadImageToCloudinary(req.file.buffer, 'facilities');
    const updatedFacility = await updateFacilityImage(BigInt(facilityId), imageUrl);
    res.status(200).json({
      success: true,
      message: "Facility Image Uploaded successfully",
      data: {
        facilityId: updatedFacility.id,
        imageUrl: updatedFacility.facilityImage
      }
    })
  } catch (error) {
    next(error)
    res.status(403).json({
      status: "Failed",
      message: "Unable to upload image"
    })
    console.log(error)
  }
}



export const deleteFacilityImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const {facilityId} = req.params;
    const { imageUrl} = req.body;
    await deleteImageFromCloudinary(imageUrl)

    const facility = await prisma.facility.findUnique({
      where: {id: BigInt(facilityId)}
    })
    if(!facility) {
      res.status(404).json({ 
        status: "failed",
        message: 'Facility not found'
      });
      return 
    }

    const updatedImages = facility.facilityImage.filter(img => img !== imageUrl);

    // Update facility with remaining images
    await prisma.facility.update({
      where: { id: BigInt(facilityId)},
      data: { facilityImage: updatedImages}
    })

     res.status(200).json({
      status: "Deleted",
      message: 'Image deleted successfully' 
    });

    return
  } catch (error: any) {
     console.error('Error deleting image:', error);
    res.status(500).json({
      status: "Failed",
      message: 'Failed to delete image',
      error: error.message
    });
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

// export const getAllFacility = async (req: Request, res: Response, next:NextFunction) => {
//   try {
//     const facilities = await getAll();
//     res.status(StatusCodes.OK).json({
//     success:true,
//     message: "Facility(s) fetch successful",
//     data: facilities});
//   } catch (error) {
//     next(error);
//   }
// }


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


export const getAllFacility = async (req: Request, res: Response, next: NextFunction) => {
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
    available: req.query.available === undefined ? undefined : req.query.available === "true" ? true : false,
    type: (req.query.type as string | undefined)?.toUpperCase() as any,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined
  };

  // filters.available = available;
    
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


export const updateCapacityController = async (req: Request, res: Response, next: NextFunction) => {
  const facilityId = BigInt(req.params.facilityId);
  const { capacity } = req.body;
  const parsedCapacity = parseInt(capacity, 10)

  if (!parsedCapacity || isNaN(parsedCapacity) || parsedCapacity < 0) {
    res.status(StatusCodes.BAD_REQUEST).json({ 
      message: "Capacity must be a positive number"
    });
    return;
  }
  try {
    const updatedFacility = await updateFacilityCapacity(facilityId, parsedCapacity);
    res.status(StatusCodes.OK).json({ 
      message: 'Capacity updated successfully', 
      data: updatedFacility
    });
    return;
    
  } catch (error) {
    next(error)
    return;
  }
};
