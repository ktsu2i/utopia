"use client";

import PostItem from "@/components/PostItem";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post, User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRInfinite from "swr/infinite";
import { z } from "zod";
import UserItem from "./_components/UserItem";

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
  };
  const getUserKey = (pageIndex: number, previousPageData: User[][]) => {
    if (previousPageData && !previousPageData.length) return null; // reaches the end
    return `http://localhost:8080/api/users/search?query=${query}&page=${pageIndex + 1}&limit=20`;
  };

  const postFetcher = useCallback(
    async (url: string) => (await axios.get<Post[]>(url, { withCredentials: true })).data,
    [],
  );
  const userFetcher = useCallback(
    async (url: string) => (await axios.get<User[]>(url, { withCredentials: true })).data,
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
  const { data: userData, size: userSize, setSize: setUserSize } = useSWRInfinite(
    getUserKey, 
    userFetcher, 
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
        <div className="relative">
          {/* Search input */}
          <div className="sticky top-0 z-10 bg-white flex gap-x-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full m-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-gray-500">
                            <SearchIcon className="h-4 w-4" />
                          </span>
                          <Input placeholder="Search" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <Tabs defaultValue="posts" className="bg-white">
            <div className="sticky top-20 z-10 bg-white px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="posts">
              {postData && postData.flat().length > 0 ? (
                postData.flat().map((post: Post) => (
                  <PostItem key={post.id} post={post} isSelected={false} />
                ))
              ) : (
                <div className="text-center text-gray-500 mt-4">No post found.</div>
              )}
            </TabsContent>
            <TabsContent value="users">
              {userData && userData.flat().length > 0 ? (
                userData.flat().map((user: User) => (
                  <UserItem user={user} />
                ))
              ) : (
                <div className="text-center text-gray-500 mt-4">No user found.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
