import { Post } from "@/lib/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Ellipsis } from "lucide-react";

interface PostItemProps {
  key: number
  post: Post
}

const PostItem: React.FC<PostItemProps> = ({
  key,
  post,
}) => {
  return (
    <div key={key} className="border-b border-x border-gray-300 last:border-b-0 p-4">
      <div className="flex gap-x-2">
        <div className="h-full">
          <Avatar>
            <AvatarFallback>
              {post.user.username.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full">
          <div className="flex justify-between">
            <span className="font-semibold">{post.user.username}</span>
            <Ellipsis className="h-4 w-4" color="gray" />
          </div>
          <div>{post.content}</div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
