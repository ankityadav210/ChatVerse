import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <div className="px-4 hover:bg-pink-500 " key={_id}>
        <div className="flex py-2 space-x-10">
          <Avatar className={" size-16"}>
            <AvatarImage src={avatar} />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-semibold">{name}</h4>

            {newMessageAlert && <h4>{newMessageAlert.count} New Message</h4>}
          </div>
        </div>
        <Separator />
      </div>
    </Link>
  );
};

export default memo(ChatItem);
