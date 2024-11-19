"use client";

import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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

export default function Messages() {
  const { isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>(`http://localhost:8080/api/users?page=`)
      }
    };
  })

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
          <div className="text-2xl font-bold border-b border-gray-300 p-4">Messages</div>
          
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
        </div>
      )}
    </>
  );
}
