"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
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
