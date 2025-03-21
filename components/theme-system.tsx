"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type * as React from "react"

export function ThemeSystem({
  children,
  ...props
}: {
  children: React.ReactNode
} & Parameters<typeof NextThemesProvider>[0]) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}