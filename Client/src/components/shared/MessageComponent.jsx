import { fileFormat } from "@/lib/features";
import moment from "moment";
import React from "react";
import RenderAttachment from "./RenderAttachment";
import { ScrollArea } from "@/components/ui/scroll-area";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timesAgo = moment(createdAt).fromNow();

  return (
    <div
      className="rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none mb-2 lg:mb:0"
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "green",
        color: "white",
        borderRadius: "10px",
        borderBottomRightRadius: sameSender ? "0px" : "10px",
        borderBottomLeftRadius: !sameSender ? "0px" : "10px",
        padding: "0.5rem",
        width: "fix-content",
      }}
    >
      {!sameSender && (
        <div className="text-black font-semibold">{sender.name}</div>
      )}
      {content && <div className="font-medium">{content}</div>}
      {/* attachments  */}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <div key={index}>
              <a href={url} target="_blank" download style={{ color: "black" }}>
                {RenderAttachment(file, url)}
              </a>
            </div>
          );
        })}

      <div className="font-light text-xs">{timesAgo}</div>
    </div>
  );
};

export default MessageComponent;
