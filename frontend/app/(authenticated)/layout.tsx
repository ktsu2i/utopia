"use client";

import MobileNavbar from "@/components/MobileNavbar";
import MobilePostButton from "@/components/MobilePostButton";
import RightSidebar from "@/components/right-sidebar/RightSidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import useAuthStore from "@/stores/authStore";
import useNotificationStore from "@/stores/notificationStore";
import axios from "axios";
import { useEffect } from "react";

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const { currentUser } = useAuthStore();
  const { setHasNewNotification } = useNotificationStore();

  // Check new notifications when user logs in
  useEffect(() => {
    const fetchCountUnseenNotifications = async () => {
      try {
        const res = await axios.get<number>("http://localhost:8080/api/notifications/unseen/count", {
          withCredentials: true,
        });
        if (res.data > 0) {
          setHasNewNotification(true);
        }
      } catch {
        // error handling
      }
    };

    fetchCountUnseenNotifications();
  }, [setHasNewNotification]);

  // Check new notifications realtime with websocket
  useEffect(() => {
    if (!currentUser?.id) return;

    const socket = new WebSocket(`ws://localhost:8080/api/ws/notifications?userId=${currentUser.id}`);

    socket.onmessage = (event) => {
      if (event.data === "new_notification") {
        setHasNewNotification(true);
      }
    };

    return () => {
      socket.close();
    };
  }, [currentUser?.id]);

  return (
    <>
      <Sidebar />
      <div className="fixed bottom-16 right-4 sm:hidden">
        <MobilePostButton />
      </div>
      <MobileNavbar />
      <RightSidebar />
      <main className="h-full md:px-[12.5%] lg:px-[33.3333%]">
        {children}
      </main>
    </>
  )
}
