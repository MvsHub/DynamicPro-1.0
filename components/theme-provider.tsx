"use client"
<<<<<<< HEAD

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type * as React from "react"

=======

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type * as React from "react"

>>>>>>> 7efb6867513876d6299191c6e9cea57bb525a9ef
export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
} & Parameters<typeof NextThemesProvider>[0]) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
<<<<<<< HEAD
}
=======
}

>>>>>>> 7efb6867513876d6299191c6e9cea57bb525a9ef
