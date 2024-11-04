"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { Post } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import useAuthStore from "@/stores/authStore";

const PostSchema = z.object({
  content: z.string().min(1).max(150),
});

const PostCard = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isAppropriate, setIsAppropriate] = useState(true);
  const { currentUser } = useAuthStore();

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof PostSchema>) => {
    try {
      const res = await axios.post<boolean>("http://localhost:8080/api/validate-text", data, { withCredentials: true });
      const isPostAppropriate = res.data;

      if (isPostAppropriate) {
        const res = await axios.post<Post>("http://localhost:8080/api/posts", data, {
          withCredentials: true
        });
        setPost(res.data);
        toast.success("Posted it!");
        form.reset();
        setIsAppropriate(true);
      } else {
        setIsAppropriate(false);
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  console.log(post); // will be removed
  console.log(isAppropriate);

  return (
    <div className="m-6 w-3/4 max-w-[600px]">
      <Card>
        <CardHeader className="text-lg font-semibold">Express yourself in Utopia!</CardHeader>
        <CardContent>
          <div className="flex gap-x-2">
            <div className="h-full">
              <Avatar>
                <AvatarFallback>
                  {currentUser?.username.substring(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="How are you doing?" className="h-32 resize-none" {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button variant="utopia" size="lg" className="my-4 w-full">Post</Button>
                </form>
              </Form>
              {!isAppropriate && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Warning!</AlertTitle>
                  <AlertDescription>
                    You were about to post inappropriate contents. 
                    <br />
                    Be respectful to everyone!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostCard;