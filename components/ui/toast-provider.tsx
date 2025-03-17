"use client"

import type React from "react"
import { X } from "lucide-react"
import { useToast, type Toast } from "@/hooks/use-toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast()

  return (
    <>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50 max-w-md w-full">
        {toasts.map((toast: Toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg border transition-all duration-300 transform translate-y-0 opacity-100 ${
              toast.variant === "destructive"
                ? "bg-red-900/90 border-red-800 text-white"
                : toast.variant === "success"
                  ? "bg-green-900/90 border-green-800 text-white"
                  : "bg-gray-900/90 border-gray-800 text-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{toast.title}</h3>
                {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
              </div>
              <button onClick={() => dismiss(toast.id)} className="ml-4 p-1 rounded-full hover:bg-gray-800/50">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

