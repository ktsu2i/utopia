"use client";

import { Post, Reaction } from "@/lib/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Ellipsis, SmilePlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button, buttonVariants } from "./ui/button";
import useAuthStore from "@/stores/authStore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useEmojis } from "@/hooks/useEmojis";

interface PostItemProps {
  post: Post
}

interface GroupedReaction extends Reaction {
  count: number;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuthStore();
  const { emojis } = useEmojis();

  const isMe = currentUser?.id === post.userId;
  const postedDate = formatDistanceToNowStrict(parseISO(post.updatedAt));

  const groupedReactions = Object.values(
    post.reactions.reduce((acc: { [key: number]: GroupedReaction }, reaction: Reaction) => {
      const emojiId = reaction.emojiId;

      if (!acc[emojiId]) {
        acc[emojiId] = { ...reaction, count: 0 };
      }
      acc[emojiId].count += 1;

      return acc;
    }, {})
  );

  const addReaction = async (emojiId: number) => {
    try {
      await axios.post<Reaction>("http://localhost:8080/api/reactions", {
        postId: post.id,
        emojiId: emojiId,
      }, { withCredentials: true });
    } catch {
    }
  };

  const removeReaction = async (reactionId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/reactions/${reactionId}`, { withCredentials: true });
    } catch {
    }
  }

  const onClick = async () => {
    setIsOpen(false);
    try {
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`, { withCredentials: true });
      toast.success("Deleted post");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border-b border-gray-300 last:border-b-0 p-4">
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-2">
          <div className="h-full">
            <Avatar>
              <AvatarFallback>
                {post.user.accountName.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full">
            <div className="flex justify-between">
              <div className="flex flex-col pb-2">
                <span className="font-semibold">{post.user.accountName}</span>
                <span className="text-sm text-gray-500">{"@" + post.user.username} &middot; {postedDate}</span>
              </div>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Ellipsis className="h-4 w-4" color="gray" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col p-2 w-24">
                  {isMe ? (
                    <>
                      <Button variant="ghost" className="justify-start">Edit</Button>
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
                              onClick={onClick} 
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
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex items-center gap-2">
          {Object.values(groupedReactions).map((groupedReaction) => (
            <Button
              key={groupedReaction.emojiId}
              variant="outline"
              size="sm"
              className={`text-sm px-2 py-1 ${groupedReaction.userId === currentUser?.id ? "bg-[#FFF5E6] border-[#FF9933]" : ""}`}
              onClick={() => {
                if (groupedReaction.userId === currentUser?.id) {
                  removeReaction(groupedReaction.id);
                }
              }}
            >
              {String.fromCodePoint(parseInt(groupedReaction.emoji.unicode, 16))} {groupedReaction.count}
            </Button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-500 rounded-full w-8 h-8 p-0">
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
                    className="text-2xl p-2"
                    onClick={() => addReaction(emoji.id)}
                  >
                    {String.fromCodePoint(parseInt(emoji.unicode, 16))}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
