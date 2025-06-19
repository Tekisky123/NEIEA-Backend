import jwt from "jsonwebtoken";
import DonorUser from "../models/DonorUser.js";
import ErrorResponse from "../utils/errorResponse.js";

export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Split and get the token part only
    token = req.headers.authorization.split(" ")[1];
  } 
  // 2. Or check for token in cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }


  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await DonorUser.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse("No user found with this ID", 404));
    }

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};
