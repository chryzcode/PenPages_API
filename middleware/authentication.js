import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";
import User from "../models/user.js";

export default async (req, res, next) => {
  // Check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and check if verified
    const user = await User.findOne({ _id: payload.userId, verified: true });
    if (!user) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    // Attach the user to the request object
    req.user = { userId: payload.userId, firstName: payload.firstName };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};
