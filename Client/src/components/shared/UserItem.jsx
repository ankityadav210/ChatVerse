import { IconButton, ListItem } from "@mui/material";
import { MinusIcon, Plus, User } from "lucide-react";
import React, { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false }) => {
  const { name, _id, avatar } = user;
  return (
    <ListItem className="border-2 rounded-lg bg-black">
      <div className="flex items-center space-x-4 w-full">
        <Avatar>
          <AvatarImage
            src={avatar}
            alt={"Upload Avatar"}
            style={{ cursor: "pointer" }}
          />

          <AvatarFallback>{<User className={"size-16"} />}</AvatarFallback>
        </Avatar>
        <div className="text-ellipsis w-full overflow-hidden text-white ">
          {name}
        </div>
        <IconButton onClick={() => handler(_id)} disabled={handlerIsLoading}>
          {isAdded ? (
            <MinusIcon className="text-white" />
          ) : (
            <Plus className="text-white" />
          )}
        </IconButton>
      </div>
    </ListItem>
  );
};
export default memo(UserItem);
