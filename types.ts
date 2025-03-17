export type Comment = {
    id: string
    postId: string
    content: string
    authorId: string
    authorName: string
    authorRole: string
    createdAt: string
  }
  
  export type Post = {
    id: string
    title: string
    content: string
    authorId: string
    authorName: string
    authorRole: "teacher" | "student"
    images?: string[]
    likes: number
    likedBy: string[]
    createdAt: string
  }
  
  // Adicionar o tipo UserRole antes da definição do tipo User
  
  export type UserRole = "teacher" | "student" | "admin"
  
  export type User = {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
    bio?: string
    formation?: string
    disciplines?: string[]
    profileImage?: string
    createdAt: string
  }
  
  
  
  
  
  