import { NEW_REQUEST, REFETCH_CHATS } from "../constants.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chats.models .js";
import { Request } from "../models/request.models .js";
import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitEvent } from "../utils/features.js";
import jwt from "jsonwebtoken";
import { uploadFilesToCloudinary } from "../utils/cloudinary.js";

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
    throw new ApiError(404, ` please enter all input fields`);
  }

  // if ([userName, bio, password, name].some((field) => field?.trim === "")) {
  //   throw new ApiError(400, `please enter ${field}`);
  // }

  // console.log(req.file);
  // upload the avatar file in the cloudinary
  const file = req.file;

  if (!file) {
    throw new ApiError(404, "please upload avatar");
  }

  const result = await uploadFilesToCloudinary([file]);
  if (!result) {
    throw new ApiError(404, "files is not uploaded successfully");
  }
  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  // check the user its existing or new

  const existingUser = await User.findOne({ userName });

  if (existingUser) {
    throw new ApiError(404, "this user is already exist");
  }

  // create an object and save into the database

  const user = await User.create({
    name,
    userName,
    bio,
    password,
    avatar,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(
      401,
      "something went wrong while registering the new user"
    );
  }
  // send back the response with status code
  // console.log(createdUser);
  return res
    .status(200)
    .json(
      new ApiResponse(202, createdUser, "register a new user successfully")
    );
});

// login controller

const loggedInUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  console.log(req.body);

  // validation
  if (!userName || !password) {
    throw new ApiError(402, "all input fields are required");
  }

  // check the user existing or not
  const user = await User.findOne({ userName });

  if (!user) {
    throw new ApiError(404, "existing user not found so register the user");
  }

  // check the password correct or not

  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "password is not correct");
  }

  // generate the token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  if (!token) {
    throw new ApiError(403, "token does not found");
  }

  const options = {
    // maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  };
  // store the token in cookies
  return res
    .status(200)
    .cookie("accessToken", token, options)
    .json(
      new ApiResponse(
        202,
        {
          user: user,
        },
        "logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  console.log(user);
  if (!user) {
    throw new ApiError(402, "logged in user does not found");
  }

  // clear the cookie data
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(202, {}, "logout successfully"));
});

// get my profile

const getMyProfile = asyncHandler(async (req, res) => {
  const userProfile = await User.findById(req.user._id);
  if (!userProfile) {
    throw new ApiError(403, "user profile does not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(202, userProfile, "successfully get the user Profile")
    );
});

const searchUser = asyncHandler(async (req, res) => {
  const { name = "" } = req.query;
  const myChats = await Chat.find({ groupChat: false, members: req.user._id });
  // get all members from my chat in this friends and other both are included
  const allMembersInMyChats = myChats.flatMap((chat) => chat.members);

  // get all users that are not my friends and me
  // users that does not have any chats
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allMembersInMyChats },
    name: { $regex: name, $options: "i" },
  });

  // modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));
  return res.status(200).json(new ApiResponse(202, users));
});

const sendFriendRequest = asyncHandler(async (req, res) => {
  // id of receiver to send a request
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, "user id does not found");
  }

  const request = await Request.findOne({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  });

  if (request) {
    throw new ApiError(400, "request is already sent");
  }

  await Request.create({
    sender: req.user._id,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json(new ApiResponse(202, [], "friend request send"));
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { requestId, accept } = req.body;
  if (!requestId) {
    throw new ApiError(404, "request id does not found");
  }

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) {
    throw new ApiError(404, "request does not found");
  }

  if (request.receiver._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to accept this request");
  }

  if (!accept) {
    await request.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(203, [], "Friend request rejected"));
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  // emit the event
  emitEvent(req, REFETCH_CHATS, members);

  return res
    .status(200)
    .json(
      new ApiResponse(
        202,
        { sender: request.sender_id },
        "friend request accepted"
      )
    );
});

const getMyNotifications = asyncHandler(async (req, res) => {
  const requests = await Request.find({ receiver: req.user._id }).populate(
    "sender",
    "name avatar"
  );

  // transform the response
  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res
    .status(200)
    .json(new ApiResponse(203, allRequests, "notifications"));
});

const getMyFriends = asyncHandler(async (req, res, next) => {});
export {
  registerUser,
  loggedInUser,
  logoutUser,
  getMyProfile,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};
