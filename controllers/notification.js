import Notification from "../models/notification";
import { BadRequestError, NotFoundError } from "../errors";
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
