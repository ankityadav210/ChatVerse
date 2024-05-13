import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // algorithm  for register a new user
  // get the all details from the frontend
  // validate all
  //  check the user is already registered or not
  // if it then return to login
  // otherwise
  // create a object in the database to store the data in the database
  // then display the information about the  new user

  // destructuring of data to get the data from the frontend
  const { userName, password, bio, name } = req.body;

  // validation the input data
  console.log(req.body);
  
  if (!userName || !password || !bio || !name) {
    throw new ApiError(404, "all input data is required");
  }

  if ([userName, bio, password, name].some((field) => field?.trim === "")) {
    throw new ApiError(400, "all fields are must be required");
  }

  // check avatar is uploaded or not

  // check the user its existing or new

  const existingUser = await User.find({ username: req.body.username });

  if (!existingUser) {
    throw new ApiError(404, "this user is already exist");
  }

  // create an object and save into the database

  const newUser = await User.create({
    name,
    userName,
    bio,
    password,
  });
  if (!newUser) {
    throw new ApiError(
      401,
      "something went wrong while registering the new user"
    );
  }
   // send back the response with status code
  console.log(newUser);
  return res
    .status(200)
    .json(new ApiResponse(202, "user is registered successfully",newUser));
});

export { registerUser };
