import { Request, Response } from "express";
import { get, update } from "../services/db/facility.service";
import { StatusCodes } from "http-status-codes";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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


export const addFacility = async(req: Request, res: Response) => {
  const { name } = req.body;
  try {
// checks if facility exist
    const facilityExist = await prisma.facility.findUnique({
      where: { name }
    });

    if (facilityExist){
      res.status(StatusCodes.CONFLICT).json({
        success: true,
        message: 'Facility already exist',
      })
      return;
    }

//Creates new facility
    const newFacility = await prisma.facility.create({
      data: req.body
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Facility created Successfully',
      data: newFacility
    })
    return;

  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Error creating facility', error
    })
    return;
  }
};

