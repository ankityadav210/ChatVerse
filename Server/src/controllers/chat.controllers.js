import { ALERT, REFETCH_CHATS } from "../constants.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chats.models .js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitEvent } from "../utils/features.js";

const generateGroupChat = asyncHandler(async (req, res) => {
  const { name, members } = req.body;
  if (!name || !members) {
    throw new ApiError(400, "all fields must be required");
  }

  const allMembers = [...members, req.user];
  const newGroupChat = await Chat.create({
    name,
    groupChat: true,
    members: allMembers,
    creator: req.user,
  });

  const groupChat = await Chat.findById(newGroupChat._id).populate("members");
  if (!groupChat) {
    throw new ApiError(401, "group chat is not created");
  }

  // call the emit event function
  emitEvent(req, ALERT, allMembers, `WELCOME  to our ${name} group`);

  emitEvent(req, REFETCH_CHATS, members);

  return res
    .status(200)
    .json(
      new ApiResponse(202, groupChat, "new group chat created successfully")
    );
});

const getMyChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "userName"
  );
  if (!chats) {
    throw new ApiError(401, "to fetching the chats there is some problem");
  }

  console.log(chats);

  return res
    .status(200)
    .json(new ApiResponse(202, chats, "chats fetched successfully"));
});

export { generateGroupChat, getMyChats };
