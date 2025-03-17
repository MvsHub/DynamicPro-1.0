"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/types"

type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  formation?: string
  disciplines?: string[]
  bio?: string
  profileImage?: string
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (userData: any, role: UserRole) => Promise<boolean>
  logout: () => void
  updateProfile: (profileData: Partial<AuthUser>) => Promise<boolean>
  error: string | null
}

// Inicializar o contexto com valores padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => false,
  error: null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Verificar se estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    if (!isClient) return

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        const userRole = localStorage.getItem("userRole")

        if (!token || !userRole) {
          setLoading(false)
          return
        }

        // Verificar token com o backend
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-Role": userRole,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)

          // Buscar perfil do usuário
          try {
            const profileResponse = await fetch("/api/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            if (profileResponse.ok) {
              const profileData = await profileResponse.json()
              if (profileData.data) {
                // Atualizar usuário com dados do perfil
                setUser((prev) => ({
                  ...prev!,
                  ...profileData.data,
                }))
              }
            }
          } catch (profileError) {
            console.error("Erro ao buscar perfil:", profileError)
          }
        } else {
          // Token inválido, remover do localStorage
          localStorage.removeItem("token")
          localStorage.removeItem("userRole")
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [isClient])

  const login = async (email: string, password: string, role: UserRole) => {
    if (!isClient) return false

    setLoading(true)
    setError(null)

    try {
      // Usar o endpoint mock para login
      const response = await fetch("/api/auth/login-mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      })

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Resposta não-JSON recebida:", text)
        setError("Erro no servidor: resposta inválida")
        setLoading(false)
        return false
      }

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Erro ao fazer login")
        setLoading(false)
        return false
      }

      // Guardar token e função do usuário
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", role)

      setUser(data.user)
      setLoading(false)

      // Redirecionar para o dashboard
      router.push("/dashboard")

      return true
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Ocorreu um erro ao tentar fazer login")
      setLoading(false)
      return false
    }
  }

  const register = async (userData: any, role: UserRole) => {
    if (!isClient) return false

    setLoading(true)
    setError(null)

    try {
      console.log("Enviando dados para registro:", { ...userData, role })

      // Usar o endpoint mock para registro
      const response = await fetch("/api/auth/registro-mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, role }),
      })

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Resposta não-JSON recebida:", text)
        setError("Erro no servidor: resposta inválida")
        setLoading(false)
        return false
      }

      const data = await response.json()
      console.log("Resposta do servidor:", data)

      if (!response.ok) {
        const errorMsg = data.message || "Erro ao registrar"
        console.error("Erro na resposta:", errorMsg, response.status)
        setError(errorMsg)
        setLoading(false)
        return false
      }

      // Após registro bem-sucedido, fazer login automático
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", role)

      setUser(data.user)
      setLoading(false)

      // Redirecionar para o dashboard
      router.push("/dashboard")

      return true
    } catch (err) {
      console.error("Erro ao registrar:", err)
      setError("Ocorreu um erro ao tentar registrar. Verifique sua conexão e tente novamente.")
      setLoading(false)
      return false
    }
  }

  const updateProfile = async (profileData: Partial<AuthUser>) => {
    if (!isClient || !user) return false

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Usuário não autenticado")
        setLoading(false)
        return false
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Erro ao atualizar perfil")
        setLoading(false)
        return false
      }

      // Atualizar usuário com os novos dados
      setUser((prev) => ({
        ...prev!,
        ...data.data,
      }))

      setLoading(false)
      return true
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err)
      setError("Ocorreu um erro ao atualizar o perfil")
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    if (!isClient) return

    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}












