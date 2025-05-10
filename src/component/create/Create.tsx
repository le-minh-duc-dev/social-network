import React, { useMemo, useRef, useState } from "react"
import { CreatePostContext } from "./CreatePostContext"
import CreateModal from "./CreateModal"

export default function Create({
  isOpen,
  onOpenChange,
}: Readonly<{ isOpen: boolean; onOpenChange: (isOpen: boolean) => void }>) {
  const [files, setFiles] = useState<FilePreview[]>([])
  const captionRef = useRef<string>("")
  const contextValue = useMemo(
    () => ({
      files,
      setFiles,
      captionRef
    }),
    [files, setFiles, captionRef]
  )
  return (
    <CreatePostContext.Provider value={contextValue}>
      <CreateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </CreatePostContext.Provider>
  )
}
