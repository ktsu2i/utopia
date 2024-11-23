"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
}) => {
  const { currentUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    if (user.id === currentUser?.id) {
      router.push("/profile"); 
    } else {
      router.push(`/profile/${user.id}`);
    }
  };

  const navigateToDM = () => {
    router.push(`/messages/${user.id}`);
  };

  return (
    <div className="w-full flex items-center justify-between border-b border-gray-300 p-4 hover:bg-gray-50">
      <div onClick={onClick} className="w-full flex items-center gap-x-4 cursor-pointer">
        <Avatar>
          <AvatarFallback>
            {user.accountName.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-lg font-bold">{user.accountName}</div>
          <div className="text-gray-500">{"@" + user.username}</div>
        </div>
      </div>
      <div>
        {currentUser?.id !== user.id && (
          <Button variant="outline" size="sm" onClick={navigateToDM}>Message</Button>
        )}
      </div>
    </div>
  );
};

export default UserItem;
