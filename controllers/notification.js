import Notification from "../models/notification.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const markNotificationRead = async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.userId;

  // Update the notification and populate fields
  let notification = await Notification.findOneAndUpdate(
    { _id: notificationId, toUser: userId },
    { read: true },
    { runValidators: true, new: true }
  )
    .populate("fromUser", "username firstName lastName imageCloudinaryUrl _id")
    .populate("toUser", "username firstName lastName imageCloudinaryUrl _id");

  if (!notification) {
    throw new NotFoundError(`Notification with ${notificationId} tied to this user does not exist`);
  }

  res.status(StatusCodes.OK).json({ notification });
};

export const allNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = await Notification.find({ toUser: userId })
    .populate("fromUser", "username firstName lastName imageCloudinaryUrl _id")
    .populate("toUser", "username firstName lastName imageCloudinaryUrl _id");
  res.status(StatusCodes.OK).json({ notifications });
};

export const allUnreadNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = await Notification.find({ toUser: userId, read: false })
    .populate("fromUser", "username firstName lastName imageCloudinaryUrl _id")
    .populate("toUser", "username firstName lastName imageCloudinaryUrl _id");
  res.status(StatusCodes.OK).json({ notifications });
};

export const allReadNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = await Notification.find({ toUser: userId, read: true })
    .populate("fromUser", "username firstName lastName imageCloudinaryUrl _id")
    .populate("toUser", "username firstName lastName imageCloudinaryUrl _id");
  res.status(StatusCodes.OK).json({ notifications });
};

export const markUnreadNotificationsRead = async (req, res) => {
  const userId = req.user.userId;
  const notifications = await Notification.find({ toUser: userId, read: false });

  // Update each notification's read status and save
  const updatePromises = notifications.map(notification => {
    notification.read = true;
    return notification.save();
  });

  // Wait for all updates to complete
  await Promise.all(updatePromises);

  const updatedNotifications = await Notification.find({ toUser: userId })
    .populate("fromUser", "username firstName lastName imageCloudinaryUrl _id")
    .populate("toUser", "username firstName lastName imageCloudinaryUrl _id");

  res.status(StatusCodes.OK).json({ updatedNotifications });
};
