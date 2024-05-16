import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chats.models .js";
import { Message } from "../models/messages.models .js";
import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitEvent } from "../utils/features.js";
import { getOtherMember } from "../lib/helper.js";
import { uploadFilesToCloudinary } from "../utils/cloudinary.js";

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

  if (!myGroups) {
    throw new ApiError(405, "group does not found");
  }

  // transformed the groups

  const groups = myGroups.map(({ _id, members, name, groupChat }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));
  return res
    .status(200)
    .json(new ApiResponse(202, groups, "group fetched SUCCESSFULLY"));
});

const addMembers = asyncHandler(async (req, res) => {
  const { chatId, members } = req.body;
  // console.log(chatId);
  const chats = await Chat.findById(chatId);
  // console.log(chats);
  if (!chats) {
    throw new ApiError(401, "chats does not found");
  }
  if (!chats.groupChat) {
    throw new ApiError(4004, "this is not a group chat ");
  }

  if (!members || members.length < 1) {
    throw new ApiError(400, "we does not provide any members ");
  }

  if (chats.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "you are not the creator of this group");
  }
  // if we apply await to get the all members take mre time then increase the speed up of system or application we use the promise
  const allNewMembersPromise = members.map((i) => User.findById(i));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers.filter(
    (i) => !chats.members.includes(i._id.toString())
  );

  chats.members.push(...uniqueMembers);

  if (chats.members.length > 100) {
    throw new ApiError(400, "group chat members limit reached");
  }

  await chats.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(",");

  // emit the event
  emitEvent(
    req,
    ALERT,
    chats.members,
    `${allUsersName} has been added in the group`
  );

  emitEvent(req, REFETCH_CHATS, chats.members);

  return res
    .status(200)
    .json(new ApiResponse(202, [], "members add successfully"));
});

const removeMember = asyncHandler(async (req, res, next) => {
  const { userId, chatId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    throw new ApiError(401, "chat does not found");
  }

  if (!chat.groupChat) {
    throw new ApiError(402, " group chat does not found");
  }

  if (chat.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "you are not allowed to remove a member from the group"
    );
  }

  if (chat.members.length <= 3) {
    throw new ApiError(400, "group must have at least three member");
  }

  const allChatMembers = chat.members.map((i) => i.toString());

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(req, ALERT, chat.members, {
    message: `${userThatWillBeRemoved.name} has been removed from the group`,
    chatId,
  });

  emitEvent(req, REFETCH_CHATS, allChatMembers);

  return res
    .status(200)
    .json(
      new ApiResponse(202, [], "member is removed from the group successfully")
    );
});

const leaveGroup = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(401, "chat does not found");
  }
  if (!chat.groupChat) {
    throw new ApiError(401, " group chat does not found");
  }
  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user._id.toString()
  );

  // if other member leave in the group then remaining  member

  if (remainingMembers.length < 3) {
    throw new ApiError(
      402,
      "so we does leave the group because it has only 3 members "
    );
  }
  // if the creator is leave the group
  if (chat.creator.toString() === req.user._id.toString()) {
    const randomElement = Math.floor(Math.random() * remainingMembers.length);
    const newCreator = remainingMembers[randomElement];
    chat.creator = newCreator;
  }

  chat.members = remainingMembers;
  // await chat.save()

  const [user] = await Promise.all([
    User.findById(req.user._id, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, ` User ${user.name} left the group`);

  return res
    .status(200)
    .json(new ApiResponse(202, [], "leave the group successfully"));
});

// send Attachments

const sendAttachments = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  // console.log(chatId);

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user._id, "name"),
  ]);

  if (!chat) {
    throw new ApiError(400, "chats does not found");
  }

  if (!chat.groupChat) {
    throw new ApiError(400, "chats does not found");
  }

  const files = req.files || [];
  console.log(files);

  if (files.length < 1) {
    throw new ApiError(403, " please provide the attachments ");
  }
  if (files.length > 5) {
    throw new ApiError(403, " does not provide more than 5 attachments");
  }

  const attachments = await uploadFilesToCloudinary(files);
  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      name: me.name,
      _id: me._id,
    },
  };

  const message = await Message.create(messageForDB);

  // emit event
  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
  return res
    .status(200)
    .json(new ApiResponse(202, message, "send attachments successfully"));
});
export {
  generateGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
};
