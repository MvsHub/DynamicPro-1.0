"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/types"

export default function FeedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Carregar posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return

      try {
        setLoadingPosts(true)
        const token = localStorage.getItem("token")
        const response = await fetch("/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar posts")
        }

        const data = await response.json()
        setPosts(data.data || [])
      } catch (err) {
        console.error("Erro ao carregar posts:", err)
        setError("Não foi possível carregar os posts. Tente novamente mais tarde.")
      } finally {
        setLoadingPosts(false)
      }
    }

    if (user) {
      fetchPosts()
    }
  }, [user])

  const handleLike = async (postId: string) => {
    if (!user || processingAction === postId) return

    try {
      setProcessingAction(postId)
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Falha ao curtir post")
      }

      const data = await response.json()

      // Atualizar post na lista
      setPosts((prev) => prev.map((post) => (post.id === postId ? data.data : post)))
    } catch (err) {
      console.error("Erro ao curtir post:", err)
      toast({
        title: "Erro",
        description: "Não foi possível processar sua ação",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleComment = (postId: string) => {
    // Implementar lógica de comentar post
    console.log("Comentar post:", postId)
  }

  const handleEdit = (post: Post) => {
    router.push(`/dashboard/posts/edit/${post.id}`)
  }

  const handleDelete = async (postId: string) => {
    if (!user || processingAction === `delete_${postId}`) return

    try {
      setProcessingAction(`delete_${postId}`)
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir post")
      }

      // Remover post da lista
      setPosts((prev) => prev.filter((post) => post.id !== postId))

      toast({
        title: "Post excluído",
        description: "O post foi excluído com sucesso",
        variant: "success",
      })
    } catch (err) {
      console.error("Erro ao excluir post:", err)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o post",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Feed</h1>
          <p className="text-gray-400 mt-1">Acompanhe as últimas atualizações</p>
        </div>

        {user.role === "teacher" && (
          <Button onClick={() => router.push("/dashboard/posts/new")} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Novo Post
          </Button>
        )}
      </header>

      {loadingPosts ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-400">Carregando posts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-900 text-red-300 p-4 rounded-md">
          {error}
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-md p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Nenhum post encontrado</h3>
          <p className="text-gray-400 mb-4">
            {user.role === "teacher"
              ? "Seja o primeiro a compartilhar algo com seus alunos!"
              : "Não há posts disponíveis no momento."}
          </p>
          {user.role === "teacher" && (
            <Button onClick={() => router.push("/dashboard/posts/new")}>Criar Primeiro Post</Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}


