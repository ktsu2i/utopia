export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  profileImageUrl: string
  bio: string
  createdAt: string
  updatedAt: string
}

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
  user: User
  content: string
  createdAt: string
  updatedAt: string
}
