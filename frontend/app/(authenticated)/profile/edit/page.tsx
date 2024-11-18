"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuthStore from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const ProfileSchema = z.object({
  accountName: z.string(),
  username: z.string(),
  firstName: z
    .string()
    .trim()
    .max(49, { message: "First name must be less than 50 characters." }),
  lastName: z
    .string()
    .trim()
    .max(49, { message: "Last name must be less than 50 characters." }),
  bio: z
    .string()
    .trim()
    .refine(async (bio) => {
      try {
        const res = await axios.post<boolean>("http://localhost:8080/api/validate-text", {
          content: bio,
        }, { withCredentials: true });
        console.log(res.data);
        return res.data;
      } catch {
        return false;
      }
    }, { message: "Inappropriate content. Be respectful to everyone." }),
});

export default function ProfileEditPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, currentUser } = useAuthStore();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      accountName: currentUser?.accountName,
      username: currentUser?.username,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      bio: currentUser?.bio,
    },
  });

  const onSubmit = async (data: z.infer<typeof ProfileSchema>) => {
    try {
      setIsLoading(true);
      await axios.patch(`http://localhost:8080/api/users/${currentUser?.id}`, data, { withCredentials: true });
      toast.success("Updated profile!");
      router.push("/profile");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div>
          <div className="text-2xl font-bold p-6">Profile</div>
          
          <div className="flex flex-col justify-center gap-y-4">
            <div className="flex justify-center mt-10">
              <Avatar className="h-28 w-28">
                <AvatarFallback className="text-2xl">
                  {currentUser?.accountName.substring(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">
                {currentUser?.accountName}
              </span>
              <div className="text-gray-500">
                {"@" + currentUser?.username}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mx-10">
                <div className="flex gap-x-2">
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Account Name:</FormLabel>
                        <FormControl>
                          <Input placeholder="Account Name" {...field} />
                        </FormControl>
                        <FormMessage />  
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Username:</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-gray-500">@</span>
                            <Input placeholder="Username" className="pl-8" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />  
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-x-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>First:</FormLabel>
                        <FormControl>
                          <Input placeholder="First" {...field} />
                        </FormControl>
                        <FormMessage />  
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Last:</FormLabel>
                        <FormControl>
                          <Input placeholder="Last" {...field} />
                        </FormControl>
                        <FormMessage />  
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bio:</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add bio here!"
                          className="h-32 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />  
                    </FormItem>
                  )}
                />
                <div className="flex justify-center gap-x-2">
                  <Button variant="outline" type="button" onClick={() => router.push("/profile")}>Cancel</Button>
                  <Button variant="utopia" type="submit">Update</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
