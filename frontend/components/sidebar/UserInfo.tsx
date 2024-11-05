"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import useAuth from "@/hooks/useAuth";
import useAuthStore from "@/stores/authStore";
import { useState } from "react";

const UserInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { currentUser } = useAuthStore();
  const { logout } = useAuth();

  const onClick = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex justify-start gap-4 py-3 mb-3 w-[250px] h-full"
        >
          <Avatar>
            <AvatarFallback>{currentUser?.accountName?.substring(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="text-left text-base font-semibold">{currentUser?.accountName}</div>
            <div className="text-left text-sm text-gray-500">{"@" + currentUser?.username}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-2 w-28">
        <Button
          onClick={onClick} 
          variant="ghost"
          className="justify-start"
        >
          Profile
        </Button>
        <Button
          onClick={logout}
          variant="ghost"
          className="justify-start text-red-600 hover:text-red-600"
        >
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default UserInfo;
