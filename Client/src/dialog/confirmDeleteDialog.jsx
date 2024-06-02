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
import { Tooltip } from "@mui/material";
import { Trash2Icon } from "lucide-react";

export function DeleteMemberDialog() {
  const deleteHandler = () => {
    console.log("delete");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Tooltip title={"Delete Group"}>
          <Trash2Icon className="size-10 text-red-600 hover:text-red-300" />
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this Group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={"p-4"}>No</AlertDialogCancel>
          <AlertDialogAction onClick={deleteHandler} className={"p-4"}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
