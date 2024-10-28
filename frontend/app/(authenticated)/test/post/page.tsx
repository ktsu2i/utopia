"use client";

import { getAllPosts } from "@/actions/getAllPosts";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface Reply {
  id: string
  userId: string
  postId: string
  parentReplyId: string
  content: string
  createdAt: string
  updatedAt: string
}

interface Post {
  id: string
  userId: string
  content: string
  replies: Reply[]
  createdAt: string
  updatedAt: string
}

const PostSchema = z.object({
  content: z.string().trim().min(1, { message: "Please enter something." })
})

export default function TestPost() {
  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof PostSchema>) => {
    try {
      const res = await axios.post<Post>("http://localhost:8080/api/posts", data, {
        withCredentials: true
      });
      setPost(res.data);
      toast.success("Posted it!");
      form.reset();
    } catch {
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getAllPosts();
        setPosts(posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [post]);

  return (
    <>
      <h1>Test Post</h1>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="utopia" size="lg" className="w-full">Post</Button>
          </form>
        </Form>
        <div>
          <ul>
            <li className="text-center">userId: {post?.userId}</li>
            <li className="text-center">content: {post?.content}</li>
          </ul>
        </div>
        <br />
        <div className="flex flex-col">
          {posts.map((post) => (
            <p key={post.id} className="text-center">
              {post.content === "" ? "---" : post.content}
            </p>
          ))}
        </div>
      </div>
    </>
  )
}