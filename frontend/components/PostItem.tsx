"use client";

import { Post } from "@/lib/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Ellipsis } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button, buttonVariants } from "./ui/button";
import useAuthStore from "@/stores/authStore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import axios from "axios";
import toast from "react-hot-toast";

interface PostItemProps {
  post: Post
}

const PostItem: React.FC<PostItemProps> = ({
  post,
}) => {
  const { currentUser } = useAuthStore();
  const isMe = currentUser?.id === post.userId;

  const onClick = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`, { withCredentials: true });
      toast.success("Deleted post");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border-b border-x border-gray-300 last:border-b-0 p-4">
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
            <span className="font-semibold">{post.user.username}</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Ellipsis className="h-4 w-4" color="gray" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={`flex flex-col p-2 ${isMe ? "w-24" : "w-32"}`}>
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
                    <Button variant="ghost" className="justify-start">Follow {post.user.username}</Button>
                    <Button variant="ghost" className="justify-start">Mute {post.user.username}</Button>
                    <Button variant="ghost" className="justify-start text-red-600 hover:text-red-600">Block {post.user.username}</Button>
                  </>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
