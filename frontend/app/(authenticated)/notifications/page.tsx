"use client";

import { Notification } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import NotificationItem from "./_components/NotificationItem";

export default function Notifications() {
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getKey = (pageIndex: number, previousPageData: Notification[][]) => {
    if (previousPageData && !previousPageData.length) return null; // reaches the end
    return `http://localhost:8080/api/notifications?page=${pageIndex + 1}&limit=20`;
  }

  const fetcher = useCallback(
    async (url: string) => (await axios.get<Notification[]>(url, { withCredentials: true })).data,
    [],
  );

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey, 
    fetcher, 
    {
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateFirstPage: true,
    }
  );

  const limit = 10;
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data?.[data?.length - 1]?.length < limit);

  const { ref, inView: isScrollEnd } = useInView();

  useEffect(() => {
    if (isScrollEnd && !isValidating && !isReachingEnd) {
      setSize(size + 1);
    }
  }, [isScrollEnd, isValidating, isReachingEnd, setSize, size]);

  // fetch the latest notifications when users access this page
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get<Notification[]>(`http://localhost:8080/api/notifications?page=1&limit=20`, {
          withCredentials: true
        });
        
        // clear SWR cache
        mutate(() => [[...res.data]], false);
      } catch {
        // error handling
      }
    }

    fetchNotifications();
  }, [mutate]);

  // fetch notifications
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/notifications/stream", { withCredentials: true });
    console.log("Calling API...");
    eventSource.onmessage = (event) => {
      console.log(event.data);
      if (event.data === "new_notification") {
        mutate();
      }
    };

    return () => {
      eventSource.close();
    };
  }, [mutate]);

  return (
    <>
      {isAuthenticated && (
        <div>
          <div className="text-2xl font-bold p-6">Notifications</div>

          <div className="flex flex-col justify-center">
            {data && data.flat().map((notification: Notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
