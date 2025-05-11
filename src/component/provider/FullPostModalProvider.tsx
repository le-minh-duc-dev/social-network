'use client'
import { FullPostContext } from "@/context/FullPostContext"
import { Post } from "@/types/schema"
import { useDisclosure } from "@heroui/react"
import React, { ReactNode, useEffect, useMemo, useState } from "react"
import FullPostModal from "../fullPostModal/FullPostModal"

export default function FullPostModalProvider({
  children,
}: {
  children: ReactNode
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [post, setPost] = useState<Post | null>(null)
  const contextValue = useMemo(
    () => ({
      setPost,
    }),
    [setPost]
  )

  useEffect(() => {
    if (post && !isOpen) {
      onOpen()
    }
  }, [post, onOpen, isOpen])

  const close = () => {
    setPost(null)
    onClose()
  }
  return (
    <FullPostContext.Provider value={contextValue}>
      <FullPostModal isOpen={isOpen} onClose={close} post={post!} />
      {children}
    </FullPostContext.Provider>
  )
}
