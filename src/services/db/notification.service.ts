import { prisma } from "../../config/config.db";
import { BadRequestError } from "../../errors/errors";

interface INotificationCreateParams {
  userId: string,
  title: string,
  message: string
}

export const createNotification = async (data: INotificationCreateParams) => {
  try {
    const notification = await prisma.notification.create({
      data
    });
    return notification;
  } catch{
    throw new BadRequestError({
      message: `Error creating notification`, 
      from: "createNotification()",
    }); 
  }
};

export const markRead = async (id: number) => {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: id,
      },
      data: ({ isRead: true }),
    });

    return notification;
  } catch{
    throw new BadRequestError({
      message: `Error updating notification`, 
      from: "markRead() notification",
    }); 
  }
};

export const getNotifications = async (userId: string) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: userId }, 
      orderBy: { createdAt: "desc"}
    });
    return notifications;
  } catch{
    throw new BadRequestError({
      message: `Error fetching notifications`, 
      from: "getNotifications()",
    }); 
  }
};