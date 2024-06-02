import UserItem from "@/components/shared/UserItem";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { sampleUser } from "@/constants/sampleData";
import { Stack, Tooltip, Typography } from "@mui/material";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";

export function AddMemberDailog({ addMember, chatId }) {
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
  const addMemberSubmitHandler = () => {
    console.log("hdhd");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Tooltip title={"Add Member"}>
          <UserPlusIcon className="size-10 text-blue-700 hover:text-blue-300" />
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Members</AlertDialogTitle>
          <AlertDialogDescription>
            Add members to your group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Stack>
          {members.length > 0 ? (
            members.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography>No Friends</Typography>
          )}
        </Stack>
        <AlertDialogFooter>
          <AlertDialogCancel className={"p-4"}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={addMemberSubmitHandler} className={"p-4"}>
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
