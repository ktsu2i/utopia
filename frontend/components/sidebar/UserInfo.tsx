"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

const UserInfo = () => {
  const { currentUser } = useCurrentUser();

  return (
    <Button
      variant="ghost"
      className="flex justify-start gap-4 py-6 w-[200px]"
    >
      <Avatar>
        <AvatarFallback>{currentUser?.username.substring(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-lg font-semibold">{currentUser?.accountName}</span>
    </Button>
  );
}

export default UserInfo;
