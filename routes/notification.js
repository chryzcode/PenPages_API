import express from "express";
import {
  allNotifications,
  markNotificationRead,
  allReadNotifications,
  allUnreadNotifications,
  markUnreadNotificationsRead,
} from "../controllers/notification.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/").get(authenticateUser, allNotifications).post(authenticateUser, markUnreadNotificationsRead);
router.route("/mark/:notificationId/read").post(authenticateUser, markNotificationRead);
router.route("/unread").get(authenticateUser, allUnreadNotifications);
router.route("/read").get(authenticateUser, allReadNotifications);

export default router;
