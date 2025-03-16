// Tipos de usuário
export type UserRole = "student" | "teacher"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  formation?: string
  disciplines?: string[]
  bio?: string
  profileImage?: string
  createdAt: string
}

// Tipos de post
export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorRole: UserRole
  images?: string[]
  likes: number
  likedBy: string[]
  createdAt: string
  updatedAt?: string
}

// Tipos de comentário
export interface Comment {
  id: string
  postId: string
  content: string
  authorId: string
  authorName: string
  authorRole: UserRole
  createdAt: string
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  mock?: boolean
}

