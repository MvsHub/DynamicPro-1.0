"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Mail, BookOpen, Briefcase } from "lucide-react"

export default function PerfilPage() {
  const { user, loading, updateProfile, error } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    formation: "",
    profileImage: "",
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Inicializar formulário com dados do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        formation: user.formation || "",
        profileImage: user.profileImage || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)

    try {
      const success = await updateProfile(formData)
      if (success) {
        setIsEditing(false)
      } else {
        setSaveError(error || "Erro ao salvar perfil")
      }
    } catch (err) {
      console.error("Erro ao salvar perfil:", err)
      setSaveError("Ocorreu um erro ao salvar o perfil")
    } finally {
      setSaving(false)
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
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-gray-400 mt-1">Visualize e edite suas informações pessoais</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cartão de perfil */}
        <Card className="bg-gray-900 border-gray-800 md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profileImage || "/placeholder.svg?height=96&width=96"} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription className="text-gray-400">
              {user.role === "teacher" ? "Professor" : "Aluno"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-gray-400">
              <Mail className="h-4 w-4 mr-2" />
              <span>{user.email}</span>
            </div>
            {user.role === "teacher" && user.formation && (
              <div className="flex items-center text-gray-400">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{user.formation}</span>
              </div>
            )}
            {user.disciplines && user.disciplines.length > 0 && (
              <div className="flex items-center text-gray-400">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>{user.disciplines.join(", ")}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant={isEditing ? "outline" : "default"}
              className="w-full"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancelar Edição" : "Editar Perfil"}
            </Button>
          </CardFooter>
        </Card>

        {/* Formulário de edição ou visualização de detalhes */}
        <Card className="bg-gray-900 border-gray-800 md:col-span-2">
          <CardHeader>
            <CardTitle>{isEditing ? "Editar Perfil" : "Detalhes do Perfil"}</CardTitle>
            <CardDescription>
              {isEditing
                ? "Atualize suas informações pessoais"
                : "Suas informações pessoais conforme aparecem para outros usuários"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Sobre Mim</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-700 min-h-[100px]"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>

                {user.role === "teacher" && (
                  <div className="space-y-2">
                    <Label htmlFor="formation">Formação</Label>
                    <Input
                      id="formation"
                      name="formation"
                      value={formData.formation}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-700"
                      placeholder="Ex: Doutor em Educação"
                    />
                  </div>
                )}

                {saveError && (
                  <div className="bg-red-900/20 border border-red-900 text-red-300 p-3 rounded-md text-sm">
                    {saveError}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Nome Completo</h3>
                  <p>{user.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                  <p>{user.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Função</h3>
                  <p>{user.role === "teacher" ? "Professor" : "Aluno"}</p>
                </div>

                {user.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Sobre Mim</h3>
                    <p className="whitespace-pre-line">{user.bio}</p>
                  </div>
                )}

                {user.role === "teacher" && user.formation && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Formação</h3>
                    <p>{user.formation}</p>
                  </div>
                )}

                {user.disciplines && user.disciplines.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Disciplinas</h3>
                    <p>{user.disciplines.join(", ")}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

