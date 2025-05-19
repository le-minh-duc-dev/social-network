import { Inter } from "next/font/google"

import "./globals.css"
import NextTopLoader from "nextjs-toploader"
import Sidebar from "@/component/sidebar/SideBar"
import { UIProvider } from "@/component/provider/UIProvider"
import { SessionProvider } from "next-auth/react"

import "react-photo-view/dist/react-photo-view.css"
import ReactQueryProvider from "@/component/provider/QueryProvider"
import AuthProvider from "@/component/provider/auth/AuthProvider"
import MediaUploadProvider from "@/component/provider/MediaUploadProvider"

const inter = Inter({ subsets: ["latin"] })

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

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader />
        <SessionProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <UIProvider>
                <MediaUploadProvider>
                  <div className="flex flex-col h-screen">
                    <main className=" flex-1 flex flex-col">
                      <Sidebar />
                      {modal}
                      {children}
                    </main>
                  </div>
                </MediaUploadProvider>
              </UIProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
