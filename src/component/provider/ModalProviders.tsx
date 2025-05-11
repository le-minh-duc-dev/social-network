"use client"

import FullPostModalProvider from "./FullPostModalProvider"
import MediaUploadProvider from "./MediaUploadProvider"

export default function ModalProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MediaUploadProvider>
      <FullPostModalProvider>{children}</FullPostModalProvider>
    </MediaUploadProvider>
  )
}
