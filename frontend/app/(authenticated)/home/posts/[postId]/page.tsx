"use client";

import PostItem from "@/components/PostItem";
import ReplyItem from "@/components/ReplyItem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Post, Reply } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { TailSpin } from "react-loader-spinner";
import useSWRInfinite from "swr/infinite";
import { z } from "zod";

const ReplySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Reply must be at least 1 character." })
    .max(150, { message: "Reply must be less than 151 characters." }),
});

export default function PostDetails() {
  const { postId } = useParams();
  const { currentUser } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppropriate, setIsAppropriate] = useState(true);

  const getKey = (pageIndex: number, previousPageData: Reply[][]) => {
    if (previousPageData && !previousPageData.length) return null; // reaches the end
    return `http://localhost:8080/api/parent-replies?postId=${postId}&page=${pageIndex + 1}&limit=10`;
  };

  const fetcher = useCallback(
    async (url: string) => (await axios.get<Reply[]>(url, { withCredentials: true })).data,
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
  const isEmpty = data?.[0].length === 0;
  const isReachingEnd = isEmpty || (data && data?.[data?.length - 1]?.length < limit);

  const { ref, inView: isScrollEnd } = useInView();

  useEffect(() => {
    if (isScrollEnd && !isValidating && !isReachingEnd) {
      setSize(size + 1);
    }
  }, [isScrollEnd, isValidating, isReachingEnd, setSize, size]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/api/ws");

    socket.onmessage = (event) => {
      if (event.data === "create_reply" || event.data === "delete_reply" || event.data === "add_reaction" || event.data === "delete_reaction") {
        mutate();
      }
    };

    return () => {
      socket.close();
    };
  }, [mutate]);

  // Realtime emoji for post
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const res = await axios.get<Post>(`http://localhost:8080/api/posts/${postId}`, { withCredentials: true });
        setPost(res.data);
      } catch {
        // no error handling
      }
    };

    fetchPost();

    const socket = new WebSocket("ws://localhost:8080/api/ws");

    socket.onmessage = (event) => {
      if (event.data === "add_reaction" || event.data === "delete_reaction") {
        fetchPost();
      }
    };

    return () => {
      socket.close();
    };
  }, [postId]);

  const form = useForm<z.infer<typeof ReplySchema>>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ReplySchema>) => {
    setIsLoading(true);

    try {
      const res = await axios.post<boolean>("http://localhost:8080/api/validate-text", data, { withCredentials: true });
      const isReplyAppropriate = res.data;

      if (isReplyAppropriate) {
        const res = await axios.post<Reply>("http://localhost:8080/api/replies", {
          postId: post?.id,
          parentReplyId: null,
          receiverId: post?.userId,
          content: data.content
        }, {
          withCredentials: true
        });
        setIsAppropriate(true);
        toast.success("Posted it!");
        form.reset();
      } else {
        setIsAppropriate(false);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="h-full flex items-center justify-center">
        <TailSpin color="#FF9933" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-white flex flex-col justify-center border-b border-gray-300">
        <PostItem post={post} isSelected={true} />
        <div className="flex gap-x-2 p-4">
          <Avatar>
            <AvatarFallback>
              {currentUser?.accountName?.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-y-4 w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <div className="w-full flex items-center gap-x-2">
                        <FormControl>
                          <Textarea
                            placeholder="Encourage others!"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          disabled={isLoading}
                          variant="ghost"
                          size="sm"
                          className="rounded-full w-8 h-8 p-1 hover:text-utopia hover:bg-utopia_light"
                        >
                          <Send className="h-5 w-5" />
                          <span className="sr-only">Reply</span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            {!isAppropriate && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle className="font-semibold">Warning!</AlertTitle>
                <AlertDescription>
                  You were about to reply with inappropriate contents. 
                  <br />
                  Be respectful to everyone!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col justify-center">
          {data && data.flat().map((reply: Reply, i: number) => (
            <ReplyItem key={i} reply={reply} isSelected={false} />
          ))}
        </div>
        {!isValidating && (<div ref={ref} aria-hidden="true" />)}
        {isValidating && (
          <div className="h-full flex items-center justify-center">
            <TailSpin color="#FF9933" />
          </div>
        )}
      </div>
    </div>
  );
}