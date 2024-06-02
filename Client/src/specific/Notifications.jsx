import { Dialog, DialogTitle } from "@/components/ui/dialog";
import React from "react";

const Notifications = () => {
  return (
    <Dialog>
      <div className="flex flex-col max-w-100">
        <DialogTitle className={"flex justify-center"}>Find People</DialogTitle>
      </div>
    </Dialog>
  );
};

export default Notifications;
