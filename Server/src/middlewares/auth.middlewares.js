import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJwtUser = asyncHandler(async (req, res, next) => {
  try {
    // get the token from cookies or header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, " so please login you does not have a token");
    }

    // decode the token or verify the token

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      throw new ApiError(400, "not have proper key so  no access");
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      throw new ApiError(404, "unauthorized user");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const authToken = socket.request.cookies?.accessToken;
    if (!authToken)
      return new ApiError(400, "not have proper key so  no access");
    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedData.userId);
    if (!user) return new ApiError(400, "not have proper key so  no access");
    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Please login to access this route"));
  }
};

export { verifyJwtUser, socketAuthenticator };
