import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import NextTopLoader from "nextjs-toploader"
import { SessionProvider } from "next-auth/react"
import { Providers } from "@/component/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata() {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    title: {
      default: "Social Network",
      template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    },
    description: "A project of Le Minh Duc",
    generator: "Next.js",
    applicationName: "Social Network",
    authors: [{ name: "Le Minh Duc", url: process.env.NEXT_PUBLIC_BASE_URL }],
    creator: "Le Minh Duc",
    publisher: "Le Minh Duc",
    icons: {
      icon: "/images/app_icon.png",
      shortcut: "/images/app_icon.png",
      apple: "/images/app_icon.png",
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextTopLoader />
        <SessionProvider>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <main className="container  mx-auto px-4 xl:px-0 flex-1 flex flex-col">
                {children}
              </main>
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}
