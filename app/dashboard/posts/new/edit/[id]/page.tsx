"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ImagePlus, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/types"

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const postId = params.id

  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirecionar se não estiver autenticado ou não for professor
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && user.role !== "teacher") {
      router.push("/dashboard")
      toast({
        title: "Acesso restrito",
        description: "Apenas professores podem editar posts",
        variant: "destructive",
      })
    }
  }, [user, loading, router, toast])

  // Carregar dados do post
  useEffect(() => {
    const fetchPost = async () => {
      if (!user || !postId) return

      try {
        setLoadingPost(true)
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar post")
        }

        const data = await response.json()
        const fetchedPost = data.data

        if (!fetchedPost) {
          throw new Error("Post não encontrado")
        }

        // Verificar se o usuário é o autor do post
        if (fetchedPost.authorId !== user.id) {
          router.push("/dashboard/feed")
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para editar este post",
            variant: "destructive",
          })
          return
        }

        setPost(fetchedPost)
        setTitle(fetchedPost.title)
        setContent(fetchedPost.content)
        setImages(fetchedPost.images || [])
      } catch (err) {
        console.error("Erro ao carregar post:", err)
        setError("Não foi possível carregar o post")
        toast({
          title: "Erro",
          description: "Não foi possível carregar o post",
          variant: "destructive",
        })
      } finally {
        setLoadingPost(false)
      }
    }

    if (user) {
      fetchPost()
    }
  }, [user, postId, router, toast])

  const handleAddImage = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl])
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError("Título e conteúdo são obrigatórios")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const token = localStorage.getItem("token")
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          images: images.length > 0 ? images : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar post")
      }

      toast({
        title: "Post atualizado com sucesso",
        description: "As alterações foram salvas",
      })

      // Redirecionar para o feed
      router.push("/dashboard/feed")
    } catch (err) {
      console.error("Erro ao atualizar post:", err)
      setError("Não foi possível atualizar o post. Tente novamente mais tarde.")
      toast({
        title: "Erro ao atualizar post",
        description: "Ocorreu um erro ao tentar atualizar o post",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || loadingPost) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post && !loadingPost) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Post não encontrado</h1>
        </header>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 text-center">
            <p className="text-gray-400 mb-4">O post que você está tentando editar não foi encontrado.</p>
            <Button onClick={() => router.push("/dashboard/feed")}>Voltar para o Feed</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Editar Post</h1>
        <p className="text-gray-400 mt-1">Atualize seu post</p>
      </header>

      <Card className="bg-gray-900 border-gray-800">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Editar Publicação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do post"
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite o conteúdo do post"
                className="bg-gray-800 border-gray-700 min-h-[200px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Imagens (opcional)</Label>
              <div className="flex space-x-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL da imagem"
                  className="bg-gray-800 border-gray-700 flex-1"
                />
                <Button type="button" onClick={handleAddImage} disabled={!imageUrl} variant="outline">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {images.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Imagens adicionadas</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Imagem ${index + 1}`}
                          className="rounded-md w-full h-40 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=160&width=320"
                            e.currentTarget.alt = "Imagem inválida"
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-900 text-red-300 p-3 rounded-md text-sm">{error}</div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/feed")}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || !title.trim() || !content.trim()}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

