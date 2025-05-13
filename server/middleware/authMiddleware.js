import jwt from "jsonwebtoken";
//  import { UnauthenticatedError } from "../errors";


export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    throw new UnauthenticatedError("Authentication required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; 
    next(); 
  } catch (error) {
    throw new UnauthenticatedError("Invalid or expired token");
  }
};
