import AppLayout from "@/components/layout/AppLayout";
import MessageComponent from "@/components/shared/MessageComponent";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sampleMessage } from "@/constants/sampleData";
import { PaperclipIcon, SendHorizonalIcon } from "lucide-react";
import React, { Fragment, useRef } from "react";

const user = {
  _id: "12",
  name: "Vercel",
};
const Chat = () => {
  const containRef = useRef(null);
  return (
    <Fragment>
      <ScrollArea className=" h-90 overflow-y-auto ">
        <div
          ref={containRef}
          className="flex flex-col box-border h-90 p-4 spacing-4 overflow-x-hidden overflow-y-auto"
        >
          {sampleMessage.map((i) => (
            <MessageComponent message={i} user={user} key={i._id} />
          ))}
        </div>
      </ScrollArea>

      <form className="h-90 ">
        <div className="flex p-4 items-center h-10 relative mt-1">
          <PaperclipIcon className="absolute size-12 left-6 hover:text-pink-800 hover:cursor-pointer text-pink-500 " />

          <Input
            placeholder="Type message here .."
            className={"h-full w-full border-none bg-pink-200 p-8 rounded-xl"}
          />

          <SendHorizonalIcon
            type="submit"
            className="text-pink-500 m-4 size-12 hover:text-pink-800 hover:cursor-pointer absolute right-4"
          />
        </div>
      </form>
    </Fragment>
  );
};

export default AppLayout()(Chat);
