import { Request, Response } from "express";
import { deleteOne, getNotifications, getOne, markRead } from "../services/db/notification.service";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/errors";

export const fetchNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await getNotifications(req.currentUser.id);

    res.status(StatusCodes.OK).json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    throw new BadRequestError({message: "Error fetching notifications", from: `fetchNotifications() controller, ${error}`})
  }
};

export const markReadNotification = async (req: Request, res: Response) => {
  try {
    const notification = await markRead(parseInt(req.params.notificationId));

    res.status(StatusCodes.OK).json({
      message: "Notification isRead successfully",
      data: notification,
    });
  } catch (error) {
    throw new BadRequestError({message: "Error updating notification", from: `markReadNotification() controller, ${error}`})
  }
}

export const deleteNotification = async (req: Request, res: Response) => {
  const notificationId = parseInt(req.params.id);
  await deleteOne(notificationId);
  res.status(StatusCodes.NO_CONTENT).send();
};

export const getNotification = async (req: Request, res: Response) => {
  const notificationId = parseInt(req.params.id);
  const notification = await getOne(notificationId);
  res.status(StatusCodes.OK).json({
    message: "Notification fetched successfully",
    data: notification,
  });
};