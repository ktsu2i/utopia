import axios from "axios";
import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";

import { Post } from "@/lib/types";

export default function Home() {
  const getKey = (pageIndex: number, previousPageData: Post[][]) => {
    if (previousPageData && !previousPageData.length) return null; // reaches the end
    return `/posts?page=${pageIndex + 1}&limit=10`;
  }

  const fetcher = useCallback(
    async (url: string) => await axios.get<Post[]>(url, { withCredentials: true }),
    [],
  );

  const { data, size, setSize } = useSWRInfinite(
    getKey, 
    fetcher, 
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateFirstPage: false,
    }
  );

  return (
    <div>Home</div>
  );
}
