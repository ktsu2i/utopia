"use client";

import dynamic from "next/dynamic";
import useAuthStore from "@/stores/authStore";

const PostCard = dynamic(() => import("./PostCard"), { ssr: false });

const RightSidebar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={`h-screen w-[12.5%] fixed top-0 right-0 border-l border-gray-300 lg:w-1/3 ${!isAuthenticated && "hidden"}`}>
      <div className="hidden lg:block">
        <PostCard />
      </div>
    </div>
  )
};

export default RightSidebar;
