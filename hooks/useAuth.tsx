"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "student" | "teacher"
  formation?: string
  disciplines?: string[]
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string, role: "student" | "teacher") => Promise<boolean>
  register: (userData: any, role: "student" | "teacher") => Promise<boolean>
  logout: () => void
  error: string | null
}

// Inicializar o contexto com valores padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  error: null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
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
        if (!token) {
          setLoading(false)
          return
        }

        // Verificar token com o backend
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Token inválido, remover do localStorage
          localStorage.removeItem("token")
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [isClient])

  const login = async (email: string, password: string, role: "student" | "teacher") => {
    if (!isClient) return false

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
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

      // Guardar token
      localStorage.setItem("token", data.token)
      setUser(data.user)
      setLoading(false)
      return true
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Ocorreu um erro ao tentar fazer login")
      setLoading(false)
      return false
    }
  }

  const register = async (userData: any, role: "student" | "teacher") => {
    if (!isClient) return false

    setLoading(true)
    setError(null)

    try {
      console.log("Enviando dados para registro:", { ...userData, role })

      // Criar um controller para abortar a requisição após um timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos de timeout

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, role }),
        signal: controller.signal,
      })

      // Limpar o timeout
      clearTimeout(timeoutId)

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
      setUser(data.user)
      setLoading(false)
      return true
    } catch (err) {
      console.error("Erro ao registrar:", err)

      // Verificar se é um erro de timeout
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Tempo limite excedido. O servidor está demorando para responder. Tente novamente mais tarde.")
      } else {
        setError("Ocorreu um erro ao tentar registrar. Verifique sua conexão e tente novamente.")
      }

      setLoading(false)
      return false
    }
  }

  const logout = () => {
    if (!isClient) return

    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}







