"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

const UserInfo = () => {
  const { currentUser } = useCurrentUser();

  return (
    <Button
      variant="ghost"
      className="flex justify-start gap-4 py-3 mb-3 w-[250px] h-full"
    >
      <Avatar>
        <AvatarFallback>{currentUser?.username.substring(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="text-left text-base font-semibold">{currentUser?.accountName}</div>
        <div className="text-left text-sm text-gray-500">{"@" + currentUser?.username}</div>
      </div>
    </Button>
  );
}

export default UserInfo;
