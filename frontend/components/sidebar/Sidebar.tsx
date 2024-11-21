"use client";

import useAuthStore from "@/stores/authStore";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={`fixed h-full w-[12.5%] border-r border-gray-300 lg:w-1/3 ${!isAuthenticated && "hidden"}`}>
      <SidebarRoutes />
    </div>
  )
};

export default Sidebar;
