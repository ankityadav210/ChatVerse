import React, { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BellIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  SquareMenuIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { useInputValidation } from "6pp";
import { List, ListItem, Tooltip } from "@mui/material";
import UserItem from "../shared/UserItem";
import { sampleNotifications, sampleUser } from "@/constants/sampleData";
import Groups from "@/pages/Groups";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const search = useInputValidation("");
  const groupName = useInputValidation("");
  const submitHandler = () => {};

  const [members, setMembers] = useState(sampleUser);
  const [selectedMembers, setSelectedMembers] = useState([]);

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
  console.log(selectedMembers);
  let isLoadingSendFriendRequest = false;

  const addFriendHandler = (id) => {
    console.log(id);
  };
  const friendRequestHandler = ({ _id, accept }) => {};
  const [users, setUsers] = useState(sampleUser);
  const navigateToGroup = () => navigate("/groups");

  return (
    <header className="h-16 bg-pink-500 mb-0 ">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="font-bold text-pretty text-3xl text-white hidden  lg:block md:block">
          CHAT-VERSE
        </div>

        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger className={"text-white  hover:text-black "}>
              <Tooltip title="Search">
                <SearchIcon />
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className={"flex justify-center"}>
                  Find People
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  id="name"
                  className=" py-5"
                  value={search.value}
                  onChange={search.changeHandler}
                  placeholder="Search for people..."
                />
              </div>
              <List>
                {users.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    handler={addFriendHandler}
                    handlerIsLoading={isLoadingSendFriendRequest}
                  />
                ))}
              </List>
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
              {sampleNotifications.length > 0 ? (
                sampleNotifications.map((i) => (
                  <NotificationItem
                    sender={i.sender}
                    _id={i._id}
                    handler={friendRequestHandler}
                    key={i._id}
                  />
                ))
              ) : (
                <div className="flex justify-center">No Notifications</div>
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

          {/* menu */}

          <Separator orientation="vertical" />
          <Dialog>
            <DialogTrigger className={"text-white  hover:text-black "}>
              <Tooltip title="Manage Groups">
                <UsersRoundIcon onClick={navigateToGroup} />
              </Tooltip>
            </DialogTrigger>
          </Dialog>

          <Separator orientation="vertical" />
          <Tooltip title="Logout">
            <LogOutIcon className="text-white hover:text-black" />
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
