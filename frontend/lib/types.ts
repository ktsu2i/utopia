export interface Reply {
  id: string
  userId: string
  postId: string
  parentReplyId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  userId: string
  content: string
  replies: Reply[]
  createdAt: string
  updatedAt: string
}
