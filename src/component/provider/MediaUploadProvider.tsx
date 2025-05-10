'use client'
import { MediaUploadContext } from "@/context/MediaUploadContext"
import { CloudinaryMediaUploadService } from "@/service/CloudinaryMediaUploadService"
import { IMediaUploadService } from "@/types/media_service"
import React, { useMemo } from "react"

export default function MediaUploadProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const uploadService = useMemo<IMediaUploadService>(
    () => new CloudinaryMediaUploadService(),
    []
  )
  return (
    <MediaUploadContext.Provider value={uploadService}>
      {children}
    </MediaUploadContext.Provider>
  )
}
