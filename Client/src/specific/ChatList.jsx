import ChatItem from "@/components/shared/ChatItem";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatList = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <ScrollArea className=" h-screen text-white bg-black pb-16 pt-1 overflow-y-auto ">
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );

        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </ScrollArea>
  );
};

export default ChatList;
