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

router("").get(authenticateUser, allNotifications)

export default router
