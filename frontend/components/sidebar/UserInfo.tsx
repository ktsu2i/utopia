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

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-full mb-3 lg:w-[250px] lg:flex-row lg:items-start lg:justify-start lg:gap-4 lg:py-3 rounded-full"
        >
          <Avatar>
            <AvatarFallback>
              {currentUser?.accountName?.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex lg:flex-col">
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
          onClick={handleLogout}
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
