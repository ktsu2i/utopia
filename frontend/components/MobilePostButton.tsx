import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import useAuthStore from "@/stores/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";

const PostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Post must be at least 1 character." })
    .max(150, { message: "Post must be less than 151 characters." }),
});

const MobilePostButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAppropriate, setIsAppropriate] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuthStore();

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
        setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-16 right-4 w-14 h-14 p-0 rounded-full shadow-lg z-10 bg-utopia flex justify-center items-center md:hidden">
          <Plus className="w-6 h-6 text-white" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] rounded-xl">
        <DialogHeader>Post</DialogHeader>
        <DialogDescription>
          <div className="flex gap-x-2">
            <div className="h-full">
              <Avatar>
                <AvatarFallback>
                  {currentUser?.accountName.substring(0, 1).toUpperCase()}
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
                            className="h-32 resize-none text-black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
        </DialogDescription>
        <DialogFooter>
          <div className="flex justify-end gap-x-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isLoading}
              onClick={form.handleSubmit(onSubmit)}
              variant="utopia"
            >
              {isLoading ? "Checking..." : "Post"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MobilePostButton;
