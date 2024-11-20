"use client";

import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import { z } from "zod";
import UserItem from "./_components/UserItem";

const MessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Message must be at least 1 character." })
    .max(150, { message: "Message must be less than 151 characters." }),
});

export default function Messages() {
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

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = () => {
    // todo
  };

  return (
    <>
      {isAuthenticated && (
        <div className="relative h-screen flex flex-col">
          <div className="text-2xl font-bold border-b border-gray-300 p-6">Messages</div>
          
          {/* Input area */}
          {/* <div className="sticky bottom-0 w-full bg-slate-300">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="h-10 resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div> */}
          {data && data.flat().map((user: User, i: number) => (
            <UserItem key={i} user={user} />
          ))}
        </div>
      )}
    </>
  );
}
