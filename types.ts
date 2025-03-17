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
  
  export type User = {
    id: string
    name: string // Alterado de 'nome' para 'name'
    email: string
    role: "teacher" | "student" | "admin"
    avatar?: string
    bio?: string
    formation?: string // Adicionado campo formation que parece estar sendo usado
    createdAt: string
  }
  
  
  