import { Post } from "@/lib/types";

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
      {post.content}
    </div>
  );
}

export default PostItem;
