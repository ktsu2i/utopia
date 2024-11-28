"use client";

import RightSidebar from "@/components/right-sidebar/RightSidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import useNotificationStore from "@/stores/notificationStore";
import { useEffect } from "react";

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const setHasNewNotification = useNotificationStore((state) => state.setHasNewNotification);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/notifications/stream", {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      if (event.data === "new_notification") {
        setHasNewNotification(true);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [setHasNewNotification]);

  return (
    <>
      <Sidebar />
      <RightSidebar />
      <main className="h-full px-[12.5%] lg:px-[33.3333%]">
        {children}
      </main>
    </>
  )
}
