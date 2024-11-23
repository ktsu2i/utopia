"use client";

import PostItem from "@/components/PostItem";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Post } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRInfinite from "swr/infinite";
import { z } from "zod";

const SearchSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Must be at least 1 character" })
    .max(100, { message: "Max 100 characters" })
});

export default function Search() {
  const { isAuthenticated } = useAuthStore();
  const [query, setQuery] = useState("");

  const getPostKey = (pageIndex: number, previousPageData: Post[][]) => {
    if (previousPageData && !previousPageData.length) return null; // reaches the end
    return `http://localhost:8080/api/posts/search?query=${query}&page=${pageIndex + 1}&limit=10`;
  }

  const postFetcher = useCallback(
    async (url: string) => (await axios.get<Post[]>(url, { withCredentials: true })).data,
    [],
  );

  const { data: postData, size: postSize, setSize: setPostSize } = useSWRInfinite(
    getPostKey, 
    postFetcher, 
    {
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateFirstPage: true,
    }
  );

  const form = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SearchSchema>) => {
    try {
      const res = await axios.post<boolean>("http://localhost:8080/api/validate-text",
        data,
        { withCredentials: true });
      const isQueryAppropriate = res.data;

      if (isQueryAppropriate) {
        // search
        setQuery(data.content);
      }
    } catch {
      // error handling
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div>
          {/* Search input */}
          <div className="flex gap-x-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>
                  <SearchIcon />
                </Button>
              </form>
            </Form>
          </div>

          {postData && postData.flat().map((post: Post) => (
            <PostItem key={post.id} post={post} isSelected={false} />
          ))}
        </div>
      )}
    </>
  );
}
