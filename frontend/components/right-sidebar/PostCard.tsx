"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import useAuthStore from "@/stores/authStore";

const PostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Post must be at least 1 character." })
    .max(150, { message: "Post must be less than 151 characters." }),
});

const PostCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAppropriate, setIsAppropriate] = useState(true);
  const [shortcutKey, setShortcutKey] = useState("");

  const { currentUser } = useAuthStore();

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Win") || userAgent.includes("Linux")) {
      setShortcutKey("Shift + Enter");
    } else if (userAgent.includes("Mac")) {
      setShortcutKey("Shift + Return");
    } else {
      setShortcutKey("");
    }
  }, []);

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof PostSchema>) => {
    setIsLoading(true);

    try {
      const res = await axios.post<boolean>("http://localhost:8080/api/validate-text", data, { withCredentials: true });
      const isPostAppropriate = res.data;

      if (isPostAppropriate) {
        await axios.post("http://localhost:8080/api/posts", data, {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isLoading) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="m-6 w-3/4 max-w-[600px]">
      <Card>
        <CardHeader className="text-lg font-semibold">Express yourself in Utopia!</CardHeader>
        <CardContent>
          <div className="flex gap-x-2">
            <div className="h-full">
              <Avatar>
                <AvatarFallback>
                  {currentUser?.accountName?.substring(0, 1).toUpperCase()}
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
                          <Textarea
                            onKeyDown={handleKeyDown}
                            placeholder="How are you doing?" 
                            className="h-32 resize-none" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {shortcutKey + " to add a new line"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={isLoading}
                    variant="utopia"
                    size="lg"
                    className="w-full mt-4"
                  >
                    {isLoading ? "Checking..." : "Post"}
                  </Button>
                </form>
              </Form>
              {!isAppropriate && (
                <Alert variant="destructive" className="mt-4">
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