import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSignIcon, Calendar, SmileIcon, User } from "lucide-react";
import moment from "moment";

const Profile = ({ user }) => {
  return (
    <div className="flex flex-col justify-center items-center space-x-2 relative top-24 ">
      <Avatar className="size-48 object-contain mb-4 ">
        <AvatarImage
          src={user?.avatar?.url || <User className={"size-40"} />}
          alt={"Upload Avatar"}
          style={{ cursor: "pointer" }}
        />

        <AvatarFallback>{<User className={"size-40 "} />}</AvatarFallback>
      </Avatar>
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <div className="flex flex-col justify-between">
        <ProfileCard
          heading={"Username"}
          text={user?.userName}
          icon={<AtSignIcon className="text-white size-10" />}
        />
        <ProfileCard
          heading={"Name"}
          text={user?.name}
          icon={<SmileIcon className="text-white size-10" />}
        />
        <ProfileCard
          heading={"Joined"}
          text={moment(user?.createdAt).fromNow()}
          icon={<Calendar className="text-white size-10" />}
        />
      </div>
    </div>
  );
};

const ProfileCard = ({ text, icon, heading }) => (
  <div className="flex items-center space-x-6 text-center p-4">
    {icon && icon}
    <div className="flex flex-col ">
      <div className="text-white">{text}</div>
      <div className="text-gray-400">{heading}</div>
    </div>
  </div>
);

export default Profile;
