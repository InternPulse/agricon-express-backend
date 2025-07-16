import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/errors";
import { uploadImageToCloudinary } from "../services/cloudinary.service";

export const uploadFacilityImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files) {
      throw new BadRequestError({
        message: "No image file provided",
        from: "UploadFacilityImage()",
      });
    }
    let imageUrls: string[] = [];

    if (!Array.isArray(req.files)) {
      throw new BadRequestError({
        message: 'Error uploading facility image',
        from: 'uploadFacilityImage()'
      });
    }

    imageUrls = await Promise.all(
      req.files.map(async (file: any) => {
        const imageUrl = await uploadImageToCloudinary(
          file.buffer,
          "facilities"
        );
        return imageUrl;
      })
    );

    res.status(200).json({
      success: true,
      message: "Facility Image Uploaded successfully",
      data: {
        imageUrls,
      },
    });
  } catch (error) {
    next(error);
  }
};