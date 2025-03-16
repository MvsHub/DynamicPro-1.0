"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import type { Comment } from "@/types"

interface CommentsSectionProps {
  postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar comentários
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return

      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/posts/${postId}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar comentários")
        }

        const data = await response.json()
        setComments(data.data || [])
      } catch (err) {
        console.error("Erro ao carregar comentários:", err)
        setError("Não foi possível carregar os comentários")
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  // Enviar novo comentário
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return

    try {
      setSubmitting(true)
      setError(null)
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar comentário")
      }

      const data = await response.json()

      // Adicionar novo comentário à lista
      setComments((prev) => [...prev, data.data])

      // Limpar campo de comentário
      setNewComment("")
    } catch (err) {
      console.error("Erro ao enviar comentário:", err)
      setError("Não foi possível enviar o comentário")
    } finally {
      setSubmitting(false)
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {/* Formulário para novo comentário */}
      {user && (
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImage || "/placeholder.svg?height=32&width=32"} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
              placeholder="Escreva um comentário..."
              rows={2}
              disabled={submitting}
            />
            <div className="flex justify-between mt-2">
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="ml-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Comentar"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de comentários */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-2">Carregando comentários...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={comment.authorName} />
                <AvatarFallback>{comment.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-800 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{comment.authorName}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        {comment.authorRole === "teacher" ? "Professor" : "Aluno"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm whitespace-pre-line">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

