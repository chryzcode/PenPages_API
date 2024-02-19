import express from "express";
import {
  allNotifications,
  markNotificationRead,
  allReadNotifications,
  allUnreadNotifications,
  markUnreadNotificationsRead,
} from "../controllers/notification.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router;

router("/").get(authenticateUser, allNotifications).post(authenticateUser, markUnreadNotificationsRead);
router("/mark/:notificationId/read").post(authenticateUser, markNotificationRead);
router("/unread").get(authenticateUser, allUnreadNotifications);
router("/read").get(authenticateUser, allReadNotifications);

export default router;
