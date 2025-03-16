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

export default function NewPostPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirecionar se não estiver autenticado ou não for professor
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && user.role !== "teacher") {
      router.push("/dashboard")
      toast({
        title: "Acesso restrito",
        description: "Apenas professores podem criar posts",
        variant: "destructive",
      })
    }
  }, [user, loading, router, toast])

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
      const response = await fetch("/api/posts", {
        method: "POST",
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
        throw new Error("Falha ao criar post")
      }

      toast({
        title: "Post criado com sucesso",
        description: "Seu post foi publicado no feed",
      })

      // Redirecionar para o feed
      router.push("/dashboard/feed")
    } catch (err) {
      console.error("Erro ao criar post:", err)
      setError("Não foi possível criar o post. Tente novamente mais tarde.")
      toast({
        title: "Erro ao criar post",
        description: "Ocorreu um erro ao tentar criar o post",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
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
      <header>
        <h1 className="text-3xl font-bold">Novo Post</h1>
        <p className="text-gray-400 mt-1">Compartilhe conhecimento com seus alunos</p>
      </header>

      <Card className="bg-gray-900 border-gray-800">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Criar Publicação</CardTitle>
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
                  Publicando...
                </>
              ) : (
                "Publicar Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

