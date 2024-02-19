import Notification from "../models/notification.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const markNotificationRead = async (req, res) => {
  const notificationId = req.params;
  const userId = req.user.userId;
  const notification = Notification.findOneAndUpdate(
    { _id: notificationId, toUser: userId },
    { read: true },
    { runValidators: true, new: true }
  );
  if (!notification) {
    throw new NotFoundError(`Notification with ${notificationId} tied to this user does not exist`);
  }
  res.status(StatusCodes.OK).json({ notification });
};

export const allNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = Notification.find({ toUser: userId });
  res.status(StatusCodes.OK).json({ notifications });
};

export const allUnreadNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = Notification.find({ toUser: userId, read: false });
  res.status(StatusCodes.OK).json({ notifications });
};

export const allReadNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = Notification.find({ toUser: userId, read: true });
  res.status(StatusCodes.OK).json({ notifications });
};

export const markUnreadNotificationsRead = async (req, res) => {
  const userId = req.user.userId;
  const notifications = Notification.find({ toUser: userId, read: false });
  (await notifications).forEach(notification => {
    notification.read = true;
  });
  console.log(notifications);
  res.status(StatusCodes.OK).json({ notifications });
};
