import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants.js";
import {
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
} from "../utils/cloudinary.js";

import { ApiError } from "../utils/ApiError.js";
import { Chat } from "../models/chats.models .js";
import { Message } from "../models/messages.models .js";
import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitEvent } from "../utils/features.js";
import { getOtherMember } from "../lib/helper.js";

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

  return res.status(201).json({
    message: "New group chat was created successfully",
    success: true,
    groupChat,
  });
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
  return res.status(200).json({
    success: true,
    chats: transformedChats,
    message: "Successfully get my chats",
  });
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
  return res.status(200).json({
    success: true,
    groups,
    message: "Successfully get my groups",
  });
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

  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
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

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
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

  return res.status(200).json({
    success: true,
    message: "Leave Group Successfully",
  });
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
  return res.status(200).json({
    success: true,
    message,
  });
});

const renameGroup = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const { name } = req.body; // name of group chat

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(401, "chat does not found");
  }

  if (!chat.groupChat) {
    throw new ApiError(404, " group chat does not found");
  }

  if (!name) {
    throw new ApiError(404, "name of group does not found");
  }
  // check if it  is admin then only  change the group name
  if (chat.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      " i am not a admin of group so we does not change the group name "
    );
  }

  chat.name = name;
  await chat.save(); // save the data into mongo db

  // emit  event
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group renamed successfully",
  });
});

const getChatDetails = asyncHandler(async (req, res) => {
  console.log("populate");
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean(); // it become the lean object not a db object just like as classical js object
    if (!chat) {
      throw new ApiError(404, "chat does not found");
    }
    chat.members = chat.members.map(({ _id, avatar, name }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      throw new ApiError(404, "chat does not found");
    }
    return res.status(200).json({
      success: true,
      chat,
      message: "chat details fetched successfully",
    });
  }
});

const deleteChat = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(404, "chat does not  found");
  }
  const members = chat.members;

  if (!chat.groupChat && chat.creator.toString() !== req.user._id.toString()) {
    throw new ApiError(404, "you are not allowed to delete the chats !");
  }

  if (!chat.groupChat && !members.includes(req.user._id.toString)) {
    throw new ApiError(404, "you are not allowed to delete the chats !");
  }

  // to delete we perform mainly two task
  //  one is to delete the message
  //  second is to delete the attachments and files

  const messageWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];
  messageWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => public_ids.push(public_id));
  });

  await Promise.all([
    // delete the files from the cloudinary
    deleteFilesFromCloudinary(public_ids),
    // delete the  single chat
    chat.deleteOne(),

    Message.deleteMany({ chat: chatId }),
  ]);

  // emit the event
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;
  const resultPerPage = 20;
  const skip = (page - 1) * resultPerPage;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(404, "chat does not found");
  }

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  console.log(totalMessagesCount);
  const totalPages = Math.ceil(totalMessagesCount / resultPerPage);

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
    message: "Message fetched successfully",
  });
});
export {
  generateGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
};
