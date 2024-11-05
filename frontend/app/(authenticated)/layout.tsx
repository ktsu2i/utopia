"use client";

import RightSidebar from "@/components/right-sidebar/RightSidebar"
import Sidebar from "@/components/sidebar/Sidebar"
import useAuthStore from "@/stores/authStore"
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <TailSpin color="#FF9933" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  };

  return (
    <>
      <Sidebar />
      <RightSidebar />
      <main className="px-[33.3333%] h-full">{children}</main>
    </>
  )
}
