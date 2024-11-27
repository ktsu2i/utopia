"use client";

import { Post, Reaction } from "@/lib/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ArrowLeft, Ellipsis, MessageCircle, SmilePlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button, buttonVariants } from "./ui/button";
import useAuthStore from "@/stores/authStore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useEmojis } from "@/hooks/useEmojis";
import { parseEmoji } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface PostItemProps {
  post: Post;
  isSelected: boolean;
}

interface GroupedReaction extends Reaction {
  count: number;
  userIds: string[];
}

const PostUpdateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Post must be at least 1 character." })
    .max(150, { message: "Post must be less than 151 characters." }),
});

const PostItem: React.FC<PostItemProps> = ({
  post,
  isSelected,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAppropriate, setIsAppropriate] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEmojisOpen, setIsEmojisOpen] = useState(false);
  const [replyCount, setReplyCount] = useState(0);
  const [shortcutKey, setShortcutKey] = useState("");
  const { currentUser } = useAuthStore();
  const { emojis } = useEmojis();

  const postedDate = formatDistanceToNowStrict(parseISO(post.updatedAt));

  const groupedReactions = Object.values(
    post.reactions.reduce((acc: { [key: number]: GroupedReaction }, reaction: Reaction) => {
      const emojiId = reaction.emojiId;

      if (!acc[emojiId]) {
        acc[emojiId] = { ...reaction, count: 0, userIds: [] };
      }
      acc[emojiId].count += 1;
      acc[emojiId].userIds.push(reaction.userId);

      return acc;
    }, {})
  );

  const addReaction = async (emojiId: number) => {
    try {
      await axios.post<Reaction>("http://localhost:8080/api/reactions", {
        postId: post.id,
        emojiId: emojiId,
				receiverId: post.userId,
      }, { withCredentials: true });
      
      setIsEmojisOpen(false);
    } catch {
      setIsEmojisOpen(false);
    }
  };

  const removeReaction = async (reactionId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/reactions/${reactionId}`, { withCredentials: true });
    } catch {
      // no error handling
    }
  };

  const handleReaction = (emojiId: number, userIds: string[]) => {
    if (userIds.includes(currentUser?.id || "")) {
      const reaction = post.reactions.find(r => r.emojiId === emojiId && r.userId === currentUser?.id);
      if (reaction) removeReaction(reaction.id);
    } else {
      addReaction(emojiId);
    }
  };

  const handleDelete = async () => {
    setIsOpen(false);
    try {
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`, { withCredentials: true });
      if (isSelected) {
        router.push("/home");
      }
      toast.success("Deleted post");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const form = useForm<z.infer<typeof PostUpdateSchema>>({
    resolver: zodResolver(PostUpdateSchema),
    defaultValues: {
      content: post.content,
    },
  });

  const onSubmit = async (data: z.infer<typeof PostUpdateSchema>) => {
    setIsLoading(true);

    try {
      const res = await axios.post<boolean>("http://localhost:8080/api/validate-text", data, { withCredentials: true });
      const isPostAppropriate = res.data;

      if (isPostAppropriate) {
        await axios.patch<Post>(`http://localhost:8080/api/posts/${post.id}`, data, {
          withCredentials: true
        });
        setIsAppropriate(true);
        toast.success("Updated post!");
        setIsOpen(false);
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
    
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const onClick = () => {
    if (!isSelected) {
      router.push(`/home/posts/${post.id}`);
    }
  };

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Win") || userAgent.includes("Linux")) {
      setShortcutKey("Ctrl + Enter");
    } else if (userAgent.includes("Mac")) {
      setShortcutKey("⌘ + Return");
    } else {
      setShortcutKey("");
    }
  }, []);

  // count replies
	useEffect(() => {
		const fetchCount = async () => {
			try {
				const res = await axios.get<number>(`http://localhost:8080/api/parent-replies/${post.id}/count`);
				setReplyCount(res.data);
			} catch {
				// error handling
			}
		};

		fetchCount();

    const socket = new WebSocket("ws://localhost:8080/api/ws");

    socket.onmessage = (event) => {
      if (event.data === "create_reply" || event.data === "delete_reply") {
        fetchCount();
      }
    };

    return () => {
      socket.close();
    }
	}, [post]);

  return (
    <div className="border-b border-gray-300 last:border-b-0 p-4">
      <div className="flex flex-col gap-y-2">
        {/* Header */}
        {isSelected && (
          <div className="flex items-center gap-5 py-2 pr-2 mb-2">
            <Link href="/home" className="p-1 rounded-full hover:bg-utopia_light hover:text-utopia">
              <ArrowLeft />
            </Link>
            <div className="font-bold text-xl">Post</div>
          </div>
        )}

        <div className="flex gap-x-2">
          <div className="h-full">
            <Avatar
              className="cursor-pointer"
              onClick={() =>
                post.userId === currentUser?.id ? 
                  router.push("/profile") : 
                  router.push(`/profile/${post.userId}`)
              }
            >
              <AvatarFallback>
                {post.user.accountName.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full">
            <div className="flex justify-between">
              <div 
                className="flex flex-col cursor-pointer pb-2"
                onClick={() =>
                  post.userId === currentUser?.id ? 
                    router.push("/profile") : 
                    router.push(`/profile/${post.userId}`)
                }
              >
                <span className="font-semibold">{post.user.accountName}</span>
                <span className="text-sm text-gray-500">{"@" + post.user.username} &middot; {postedDate}</span>
              </div>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:text-utopia hover:bg-utopia_light">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col p-2 w-24">
                  {currentUser?.id === post.userId ? (
                    <>
                      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="justify-start">Edit</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            <div className="flex gap-x-2">
                              <div className="h-full">
                                <Avatar>
                                  <AvatarFallback>
                                    {post.user.accountName.substring(0, 1).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="w-full">
                                <Form {...form}>
                                  <form>
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
                            <DialogClose asChild>
                              <Button type="button" variant="ghost">
                                Cancel
                              </Button>
                            </DialogClose>
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    disabled={isLoading}
                                    onClick={form.handleSubmit(onSubmit)}
                                    variant="utopia"
                                  >
                                    {isLoading ? "Checking..." : "Save"}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{shortcutKey}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="justify-start text-red-600 hover:text-red-600"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this post. 
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete} 
                              className={buttonVariants({ variant: "destructive" })}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="justify-start">Follow</Button>
                      <Button variant="ghost" className="justify-start">Mute</Button>
                      <Button variant="ghost" className="justify-start text-red-600 hover:text-red-600">Block</Button>
                    </>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div
              onClick={onClick} 
              className={`whitespace-pre-wrap break-all ${isSelected ? "text-lg py-2" : "cursor-pointer"}`}
            >
              {post.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {Object.values(groupedReactions).map((groupedReaction) => (
              <Button
                key={groupedReaction.emojiId}
                variant="outline"
                size="sm"
                className={`text-sm px-2 py-1 ${groupedReaction.userIds.includes(currentUser?.id || "") ? "bg-utopia_light border-utopia" : ""}`}
                onClick={() => handleReaction(groupedReaction.emojiId, groupedReaction.userIds)}
              >
                {parseEmoji(groupedReaction.emoji.unicode)} {groupedReaction.count}
              </Button>
            ))}
            <Popover open={isEmojisOpen} onOpenChange={setIsEmojisOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 rounded-full w-8 h-8 p-0 hover:text-utopia hover:bg-utopia_light"
                >
                  <SmilePlus className="h-5 w-5" />
                  <span className="sr-only">Add reaction</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid grid-cols-4 gap-2">
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji.name}
                      variant="ghost"
                      className="text-2xl p-2 hover:bg-utopia_light"
                      onClick={() => addReaction(emoji.id)}
                    >
                      {parseEmoji(emoji.unicode)}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div onClick={onClick} className="flex items-center gap-x-1 text-gray-500 px-2 py-1 hover:text-utopia hover:bg-utopia_light rounded-2xl cursor-pointer">
						<MessageCircle className="h-5 w-5" />
						<span>{replyCount}</span>
					</div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
