"use client"

import { useState } from "react"
import { MessageSquare, Heart, Share2, MoreVertical } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CommentsSection from "@/components/comments-section" // Removidas as chaves para importar como default export
import type { Post } from "@/types"
import { useAuth } from "@/hooks/useAuth"

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onEdit?: (post: Post) => void
  onDelete?: (postId: string) => void
}

export function PostCard({ post, onLike, onComment, onEdit, onDelete }: PostCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)

  const isAuthor = user?.id === post.authorId
  const canEdit = isAuthor && user?.role === "teacher"

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} segundos atrás`

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} minutos atrás`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} horas atrás`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays} dias atrás`

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) return `${diffInMonths} meses atrás`

    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} anos atrás`
  }

  const timeAgo = formatTimeAgo(post.createdAt)

  const handleLike = () => {
    if (onLike) onLike(post.id)
  }

  const handleComment = () => {
    if (onComment) {
      onComment(post.id)
    } else {
      setShowComments(!showComments)
    }
  }

  const handleEdit = () => {
    if (onEdit && canEdit) onEdit(post)
  }

  const handleDelete = () => {
    if (onDelete && canEdit) onDelete(post.id)
  }

  return (
    <Card className="mb-4 bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={post.authorName} />
            <AvatarFallback>{post.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.authorName}</div>
            <div className="text-xs text-gray-400 flex items-center space-x-1">
              <span>{post.authorRole === "teacher" ? "Professor" : "Aluno"}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Mais opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-500">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="pt-3">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-300 whitespace-pre-line">{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className="mt-3 grid gap-2">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Imagem ${index + 1} do post`}
                className="rounded-md max-h-96 w-auto object-contain"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-gray-800 pt-3 flex justify-between">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500" onClick={handleLike}>
          <Heart
            className={`h-5 w-5 mr-1 ${post.likedBy?.includes(user?.id || "") ? "fill-red-500 text-red-500" : ""}`}
          />
          <span>{post.likes || 0}</span>
        </Button>

        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-500" onClick={handleComment}>
          <MessageSquare className="h-5 w-5 mr-1" />
          <span>Comentar</span>
        </Button>

        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500">
          <Share2 className="h-5 w-5 mr-1" />
          <span>Compartilhar</span>
        </Button>
      </CardFooter>

      {showComments && (
        <div className="px-6 py-3 border-t border-gray-800">
          <CommentsSection postId={post.id} />
        </div>
      )}
    </Card>
  )
}


