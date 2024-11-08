"use client";

import axios from "axios";
import { useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import { TailSpin } from "react-loader-spinner";

import { Post } from "@/lib/types";
import PostItem from "@/components/PostItem";
import useAuthStore from "@/stores/authStore";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const getKey = (pageIndex: number, previousPageData: Post[][]) => {
    if (previousPageData && !previousPageData.length) return null; // reaches the end
    return `http://localhost:8080/api/posts?page=${pageIndex + 1}&limit=10`;
  }

  const fetcher = useCallback(
    async (url: string) => (await axios.get<Post[]>(url, { withCredentials: true })).data,
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
  const eventTypes = ["create_post", "delete_post", "delete_user", "add_reaction", "delete_reaction"];

  const { ref, inView: isScrollEnd } = useInView();

  useEffect(() => {
    if (isScrollEnd && !isValidating && !isReachingEnd) {
      setSize(size + 1);
    }
  }, [isScrollEnd, isValidating, isReachingEnd, setSize, size]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/api/ws");

    socket.onmessage = (event) => {
      if (eventTypes.includes(event.data)) {
        mutate();
      }
    };

    return () => {
      socket.close();
    };
  }, [mutate]);

  return (
    <>
      {isAuthenticated && data && (
        <div className="flex flex-col justify-center">
          {data.flat().map((post: Post, i: number) => (
            <PostItem key={i} post={post} />
          ))}
        </div>
      )}
      {!isValidating && (<div ref={ref} aria-hidden="true" />)}
      {isValidating && (
        <div className="h-full flex items-center justify-center">
          <TailSpin color="#FF9933" />
        </div>
      )}
    </>
  );
}
