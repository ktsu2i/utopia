"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuthStore from "@/stores/authStore";

const ProfileHeader = () => {
  const { currentUser } = useAuthStore();

  return (
    <div>
      <div className="text-2xl font-bold p-4">Profile</div>
      <div className="flex justify-center mt-10">
        <Avatar className="h-28 w-28">
          <AvatarFallback>
            {currentUser?.accountName.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>10 Followings</div>
        <div>10 Followers</div>
      </div>
    </div>
  );
};

export default ProfileHeader;
