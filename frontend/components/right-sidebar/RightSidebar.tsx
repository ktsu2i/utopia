"use client";

import dynamic from "next/dynamic";
import useAuthStore from "@/stores/authStore";

const PostCard = dynamic(() => import("./PostCard"), { ssr: false });

const RightSidebar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={`h-screen w-1/3 fixed top-0 right-0 border-l border-gray-300 ${!isAuthenticated && "hidden"}`}>
      <PostCard />
    </div>
  )
};

export default RightSidebar;
