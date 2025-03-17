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
  