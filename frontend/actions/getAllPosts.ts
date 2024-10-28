import axios from "axios"

interface Reply {
  id: string
  userId: string
  postId: string
  parentReplyId: string
  content: string
  createdAt: string
  updatedAt: string
}

interface Post {
  id: string
  userId: string
  content: string
  replies: Reply[]
  createdAt: string
  updatedAt: string
}

export const getAllPosts = async () => {
  try {
    const res = await axios.get<Post[]>("http://localhost:8080/api/posts", {
      withCredentials: true
    });
    
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};