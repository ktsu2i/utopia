export interface User {
  id: string
  accountName: string
  username: string
  firstName: string
  lastName: string
  email: string
  profileImageUrl: string
  bio: string
  createdAt: string
  updatedAt: string
}

export interface Reply {
  id: string
  userId: string
  user: User
  postId: string
  post: Post
  parentReplyId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Emoji {
  id: number
  name: string
  unicode: string
  imageUrl: string
  creatorId: string
  createdAt: string
  updatedAt: string
}

export interface Reaction {
  id: number
  postId: string
  userId: string
  emojiId: number
  createdAt: string
  updatedAt: string
  emoji: Emoji
}

export interface Post {
  id: string
  userId: string
  user: User
  content: string
  createdAt: string
  updatedAt: string
  reactions: Reaction[]
}

