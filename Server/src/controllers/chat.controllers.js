import { ALERT, REFETCH_CHATS } from "../constants.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chats.models .js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitEvent } from "../utils/features.js";
import { getOtherMember } from "../lib/helper.js";
import { id_ID } from "@faker-js/faker";

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
    "name avatar"
  );
  if (!chats) {
    throw new ApiError(401, "to fetching the chats there is some problem");
  }
  console.log(chats);

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.user);

    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user._id.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });
  return res
    .status(200)
    .json(new ApiResponse(202, transformedChats, "chats fetched successfully"));
});

const getMyGroups = asyncHandler(async (req, res) => {
  const myGroups = await Chat.find({
    members: req.user,
    creator: req.user,
    groupChat: true,
  }).populate("members", " name avatar");
  
     if(!myGroups){
        throw new ApiError(405,"group does not found");
     }

     // transformed the groups 

     const groups = myGroups.map(({_id,members,name,groupChat})=>({
         _id,
        groupChat,
        name,
        avatar:members.slice(0,3).map(({avatar})=> avatar.url),
     }));
   return res.status(200).json(new ApiResponse(202,groups,"group fetched SUCCESSFULLY"));
});



export { generateGroupChat, getMyChats, getMyGroups };
