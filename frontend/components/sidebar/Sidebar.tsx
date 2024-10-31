"use client";

import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  return (
    <div className="h-full w-1/3 fixed mt-10">
      <div className="">
        <SidebarRoutes />
      </div>
    </div>
  )
};

export default Sidebar;
