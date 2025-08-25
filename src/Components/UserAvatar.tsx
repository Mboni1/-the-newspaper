import React from "react";
import { User } from "lucide-react";

const UserAvatar: React.FC = () => {
  return (
    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
      <User className="w-5 h-5 text-white" />
    </div>
  );
};

export default UserAvatar;
