"use client";

import { TailSpin } from "react-loader-spinner";
import { z } from "zod";

import useAuth from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const GroqSchema = z.object({
  input: z.string().trim().min(1, { message: "Please enter something." })
})

export default function Demo() {
  const [isAppropriate, setIsAppropriate] = useState(true);
  const { isAuthenticated } = useAuth();

  const form = useForm<z.infer<typeof GroqSchema>>({
    resolver: zodResolver(GroqSchema),
    defaultValues: {
      input: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof GroqSchema>) => {
    try {
      const res = await axios.post("http://localhost:8080/api/text/check", data, { withCredentials: true });
      setIsAppropriate(res.data);
      if (!isAppropriate) {
        toast.success("Posted it!");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <TailSpin color="#FF9933" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex flex-col w-4/5 md:w-2/5 xl:w-1/4 space-y-4">
        <h1 className="text-2xl font-bold mb-5">Demo page</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input</FormLabel>
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
        {!isAppropriate && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              You were about to post inappropriate contents. Be respectful to everyone!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}