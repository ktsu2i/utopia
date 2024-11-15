"use client";

import PostItem from "@/components/PostItem";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Post, Reply } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
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
        const res = await axios.post<Reply[]>("http://localhost:8080/api/replies", {
          post: post,
          parentReplyId: "",
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
    <>
      <div className="flex flex-col justify-center border-b border-gray-300">
        <PostItem post={post} isSelected={true} />
        <div className=" flex gap-x-2 p-4">
          <Avatar>
            <AvatarFallback>
              {currentUser?.accountName?.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center w-full gap-x-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Encourage others!"
                          className="w-full resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-1 hover:text-utopia hover:bg-utopia_light"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Reply</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}