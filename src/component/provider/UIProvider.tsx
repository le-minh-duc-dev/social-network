// app/providers.tsx
"use client"

import { HeroUIProvider } from "@heroui/react"
import Lenis from "lenis"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >
  }
}

export function UIProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
    })

    lenis.on("scroll", (e) => {
      console.log("Scroll event", e)
    })

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
