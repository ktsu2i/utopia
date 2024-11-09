"use client";

import PostItem from "@/components/PostItem";
import { Post } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

export default function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const res = await axios.get<Post>(`http://localhost:8080/api/posts/${postId}`, { withCredentials: true });
        setPost(res.data);
      } catch {
        // no error handling
      }
    };

    fetchPost();

    const socket = new WebSocket("ws://localhost:8080/api/ws");

    socket.onmessage = (event) => {
      if (event.data === "add_reaction" || event.data === "delete_reaction") {
        fetchPost();
      }
    };

    return () => {
      socket.close();
    };
  }, [postId]);

  if (!post) {
    return (
      <div className="h-full flex items-center justify-center">
        <TailSpin color="#FF9933" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center">
        <PostItem post={post} isSelected={true} />
      </div>
    </>
  );
}