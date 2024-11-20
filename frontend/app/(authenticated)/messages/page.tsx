"use client";

import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import UserItem from "./_components/UserItem";

export default function UserListPage() {
  const { isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  const getKey = (pageIndex: number, previousPageData: User[][]) => {
    if (previousPageData && !previousPageData.length) return null; // reaches the end
    return `http://localhost:8080/api/users?page=${pageIndex + 1}&limit=20`;
  };

  const fetcher = useCallback(
    async (url: string) => (await axios.get<User[]>(url, { withCredentials: true })).data,
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

  return (
    <>
      {isAuthenticated && (
        <div className="relative h-screen flex flex-col">
          <div className="text-2xl font-bold p-6">Messages</div>
          
          {data && data.flat().map((user: User, i: number) => (
            <UserItem key={i} user={user} />
          ))}
        </div>
      )}
    </>
  );
}
