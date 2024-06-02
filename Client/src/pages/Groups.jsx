
import UserItem from "@/components/shared/UserItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { sampleChats, sampleUser } from "@/constants/sampleData";
import { AddMemberDailog } from "@/dialog/AddMemberDialog";
import { DeleteMemberDialog } from "@/dialog/confirmDeleteDialog";
import { Drawer, Grid, IconButton, Stack, Tooltip } from "@mui/material";
import {
  CheckIcon,
  CircleChevronLeftIcon,
  MenuIcon,
  PencilIcon,
  User,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
  };
  const removeMemberHandler = (id) => {
    console.log("Remove Member", id);
  };
  console.log(chatId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const updateGroupName = () => {
    setIsEdit(false);
    console.log(groupNameUpdatedValue);
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <IconButton
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
        onClick={handleMobile}
      >
        <MenuIcon />
      </IconButton>
      <Tooltip title={"back"}>
        <CircleChevronLeftIcon
          className="absolute top-8 left-8 size-12"
          onClick={navigateBack}
        />
      </Tooltip>
    </>
  );

  const GroupName = (
    <div className="flex items-center justify-center space-x-4 p-12">
      {isEdit ? (
        <>
          <Input
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            className={"p-6 "}
            placeholder={"Enter group name ..."}
          />
          <CheckIcon onClick={updateGroupName} />
        </>
      ) : (
        <>
          <h4 className="text-2xl font-bold text-gray-800">{groupName}</h4>
          <Tooltip title={"edit"}>
            <PencilIcon onClick={() => setIsEdit(true)} />
          </Tooltip>
        </>
      )}
    </div>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
      spacing={{
        xs: "1rem",
        sm: "1rem",
        md: "6rem",
      }}
    >
      <DeleteMemberDialog />
      <AddMemberDailog />
    </Stack>
  );

  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        sm={4}
      >
        <GroupsList myGroups={sampleChats} chatId={chatId} />
      </Grid>
      <Grid
        item
        x={12}
        sm={8}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "1rem 3rem",
          position: "relative",
        }}
      >
        {IconBtns}
        {groupName && (
          <>
            {GroupName}
            <Card className={"w-full h-90 overflow-y-auto"}>
              <CardHeader>
                <CardTitle>Members</CardTitle>
              </CardHeader>
              <CardContent>
                {sampleUser?.map((i) => (
                  <UserItem
                    key={i._id}
                    user={i}
                    isAdded
                    handler={removeMemberHandler}
                  />
                ))}
              </CardContent>
            </Card>
            {ButtonGroup}
          </>
        )}
      </Grid>

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList
          myGroups={sampleChats}
          chatId={chatId}
          className={"w-6/12"}
        />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ myGroups = [], chatId }) => (
  <ScrollArea className="h-screen w-full flex-col overflow-auto bg-black text-white">
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <div className="text-center p-4 ">No groups</div>
    )}
  </ScrollArea>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <div className="flex m-4 space-x-4 items-center">
        <Avatar>
          <AvatarImage
            src={avatar}
            alt={"Upload Avatar"}
            style={{ cursor: "pointer" }}
          />

          <AvatarFallback>{<User className={"size-12"} />}</AvatarFallback>
        </Avatar>
        <div>{name}</div>
      </div>
      <Separator />
    </Link>
  );
});


export default Groups;
