"use client";

import axios from "axios";
import { useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import { TailSpin } from "react-loader-spinner";

import { Post } from "@/lib/types";

export default function Home() {
  const getKey = (pageIndex: number, previousPageData: Post[][]) => {
    if (previousPageData && !previousPageData.length) return null; // reaches the end
    return `http://localhost:8080/api/posts?page=${pageIndex + 1}&limit=10`;
  }

  const fetcher = useCallback(
    async (url: string) => (await axios.get<Post[]>(url, { withCredentials: true })).data,
    [],
  );

  const { data, size, setSize, isValidating } = useSWRInfinite(
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
      {data && (
        <div className="flex flex-col gap-6 justify-center">
          {data.flat().map((post, i) => (
            <div key={i} className="bg-slate-200 h-[100px] m-2">{post.content}</div>
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
