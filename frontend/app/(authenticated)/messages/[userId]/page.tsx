"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Message must be at least 1 character." })
    .max(150, { message: "Message must be less than 151 characters." }),
});

export default function ChatPage() {
  const { userId } = useParams();
  const { isAuthenticated, currentUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppropriate, setIsAppropriate] = useState(true);

  // fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get<User>(`http://localhost:8080/api/users/${userId}`, { withCredentials: true });
      setUser(res.data);
    };

    fetchUser();
  }, [userId]);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);

    try {
      const res = await axios.post<boolean>("http://localhost:8080/api/validate-text", data, { withCredentials: true });
      const isMessageAppropriate = res.data;

      if (isMessageAppropriate) {
        await axios.post("http://localhost:8080/api/messages", data, { withCredentials: true });
        setIsAppropriate(true);
        form.reset();
      } else {
        setIsAppropriate(false);
      }
    } catch {
      // error handling
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {isAuthenticated && (
        <div className="relative h-screen flex flex-col">
          <div className="text-2xl font-bold border-b border-gray-300 p-6">
            {user?.accountName}
          </div>

          <div className="flex-grow overflow-auto">something</div>

          {/* Input area */}
          <div className="sticky bottom-0 z-10 bg-white justify-center border-t border-gray-300">
            <div className="flex gap-x-2 p-4">
              <Avatar>
                <AvatarFallback>
                  {currentUser?.accountName.substring(0, 1).toUpperCase()}
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
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              // disabled={isLoading}
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
        </div>
      )}
    </>
  );
}