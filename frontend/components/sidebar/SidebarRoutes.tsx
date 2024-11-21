"use client";

import { Bell, Home, Mail, Search, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation"
import SidebarItem from "./SidebarItem";
import UserInfo from "./UserInfo";

const SidebarRoutes = () => {
  const pathname = usePathname();

  const routes = [
    {
      icon: Home,
      label: "Home",
      href: "/home",
      active: pathname.startsWith("/home"),
    },
    {
      icon: Search,
      label: "Search",
      href: "/search",
      active: pathname === "/search",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      active: pathname === "/notifications",
    },
    {
      icon: Mail,
      label: "Messages",
      href: "/messages",
      active: pathname.startsWith("/messages"),
    },
    {
      icon: User,
      label: "Profile",
      href: "/profile",
      active: pathname.startsWith("/profile"),
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full pt-10 lg:mr-6">
      <div className="flex flex-col items-center gap-4 lg:items-end">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            active={route.active}
          />
        ))}
      </div>
      <div className="flex flex-col items-center lg:items-end">
        <UserInfo />
      </div>
    </div>
  );
};

export default SidebarRoutes;
