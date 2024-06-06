import { useInputValidation } from "6pp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sampleNotifications, sampleUser } from "@/constants/sampleData";
import { ListItem, Tooltip } from "@mui/material";
import axios from "axios";
import {
  BellIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  SquareMenuIcon,
  UsersRoundIcon,
} from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../../constants/config";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
  useLazySearchUserQuery,
  useMyChatsQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { userNotExists } from "../../redux/reducers/auth";
import ChatList from "../../specific/ChatList";
import UserItem from "../shared/UserItem";
import { Input } from "../ui/input";

const Header = () => {
  const params = useParams();
  const chatId = params.chatId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useInputValidation("");
  const groupName = useInputValidation("");
  const submitHandler = () => {};

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    console.log("Delete Chat", _id, groupChat);
  };

  const [members, setMembers] = useState(sampleUser);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { data, isLoading } = useMyChatsQuery("");
  const [searchUser] = useLazySearchUserQuery("");
  const [sendfriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async ({ _id, accept }) => {
    try {
      const res = await acceptRequest({ requestId: _id, accept });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
      } else toast.error(res?.data?.error || "Something went wrong");
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: notificationData,
    isLoading: loading,
    isError: isNotificationError,
    error: notificationError,
  } = useGetNotificationsQuery();
  useErrors([{ notificationError, isNotificationError }]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data?.users))
        .catch((e) => console.log(e));
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  const selectMemberHandler = (id) => {
    setMembers((prev) =>
      prev.map((user) =>
        user._id === id
          ? {
              ...user,
              isAdded: !user.isAdded,
            }
          : user
      )
    );

    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };
  // console.log(selectedMembers);

  const addFriendHandler = async (id) => {
    await sendfriendRequest("Sending friend request", { userId: id });
  };
  const [users, setUsers] = useState([]);
  const navigateToGroup = () => navigate("/groups");
  const logOuthandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/users/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <header className="h-16 bg-pink-500 mb-0 ">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="font-bold text-pretty text-3xl text-white hidden  lg:block md:block">
          CHAT-VERSE
        </div>

        {/* search */}

        <div className="flex items-center space-x-4 overflow-y-auto">
          <Dialog>
            <DialogTrigger className={"text-white  hover:text-black "}>
              <Tooltip title="Search">
                <SearchIcon />
              </Tooltip>
            </DialogTrigger>
            <DialogContent className={"h-96 w-80"}>
              <DialogHeader>
                <DialogTitle className={"flex justify-center"}>
                  Find People
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4  ">
                <Input
                  id="name"
                  className=" py-5"
                  value={search.value}
                  onChange={search.changeHandler}
                  placeholder="Search for people..."
                />
              </div>
              <ScrollArea className=" overflow-y-auto ">
                {/* <List className="overflow-y-auto "> */}
                {users.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    handler={addFriendHandler}
                    handlerIsLoading={isLoadingSendFriendRequest}
                  />
                ))}
                {/* </List> */}
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Notifications */}

          <Separator orientation="vertical" />
          <Dialog>
            <DialogTrigger className={"text-white  hover:text-black "}>
              <Tooltip title="Notifications">
                <BellIcon />
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className={"flex justify-center"}>
                  Notifications
                </DialogTitle>
              </DialogHeader>
              {loading ? (
                <div>loading,.,.,.,</div>
              ) : (
                <>
                  <ScrollArea className=" overflow-y-auto ">
                    {notificationData?.allRequests.length > 0 ? (
                      notificationData?.allRequests.map((i) => (
                        <NotificationItem
                          sender={i.sender}
                          _id={i._id}
                          handler={friendRequestHandler}
                          key={i._id}
                        />
                      ))
                    ) : (
                      <div className="flex justify-center">
                        No Notifications
                      </div>
                    )}
                  </ScrollArea>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* newGroup */}

          <Separator orientation="vertical" />
          <Dialog>
            <DialogTrigger className={"text-white  hover:text-black "}>
              <Tooltip title="Create Group">
                <PlusIcon />
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className={"flex justify-center"}>
                  New Group
                </DialogTitle>
              </DialogHeader>

              <Input
                placeholder={"Enter group name ..."}
                value={groupName.value}
                onChange={groupName.changeHandler}
                className={"py-4"}
              />
              <div>Members</div>
              <div className="flex flex-col">
                {members.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    handler={selectMemberHandler}
                    isAdded={selectedMembers.includes(i._id)}
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <Button
                  className={"py-4 border border-red-500 text-red-500"}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button
                  className={"py-4 border border-blue-600 text-blue-600"}
                  onClick={submitHandler}
                  variant={"outline"}
                >
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* manage group */}

          <Separator orientation="vertical" />
          <Dialog>
            <DialogTrigger className={"text-white  hover:text-black "}>
              <Tooltip title="Manage Groups">
                <UsersRoundIcon onClick={navigateToGroup} />
              </Tooltip>
            </DialogTrigger>
          </Dialog>

          {/* mobile menu chats */}

          <Separator orientation="vertical" />
          <Sheet>
            <SheetTrigger asChild>
              <SquareMenuIcon className="block sm:hidden text-white hover:text-black" />
            </SheetTrigger>
            <SheetContent className={"bg-black text-white p-0"} side={"left"}>
              <SheetHeader>
                <SheetTitle>Chats</SheetTitle>
              </SheetHeader>

              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
              />
              <Separator />
            </SheetContent>
          </Sheet>

          {/* logout */}

          <Separator orientation="vertical" />
          <Tooltip title="Logout">
            <LogOutIcon
              className="text-white hover:text-black hover:cursor-pointer"
              onClick={logOuthandler}
            />
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem className="border-2 rounded-lg bg-black ">
      <div className="flex items-center space-x-4 w-full">
        <Avatar>
          <AvatarImage
            src={avatar}
            alt={"Upload Avatar"}
            style={{ cursor: "pointer" }}
          />

          <AvatarFallback>{"https://github.com/shadcn.png"}</AvatarFallback>
        </Avatar>
        <div className="text-ellipsis w-full overflow-hidden text-white">
          {`${name} send you a friend request`}
        </div>
        <div className="flex gap-4 ">
          <Button
            variant={"secondary"}
            onClick={() => handler({ _id, accept: true })}
          >
            Accept
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => handler({ _id, accept: false })}
          >
            Reject
          </Button>
        </div>
      </div>
    </ListItem>
  );
});

export default Header;
