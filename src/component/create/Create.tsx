import React, { useCallback, useMemo, useRef, useState } from "react"
import { CreatePostContext } from "./CreatePostContext"
import CreateModal from "./CreateModal"

export default function Create({
  isOpen,
  onOpenChange,
}: Readonly<{ isOpen: boolean; onOpenChange: (isOpen: boolean) => void }>) {
  const [files, setFiles] = useState<FilePreview[]>([])
  const captionRef = useRef<string>("")

  const handleSubmit = useCallback(() => {
    console.log(files);
    console.log("Form submitted with caption:", captionRef.current)
  }, [captionRef,files])

  const contextValue = useMemo(
    () => ({
      files,
      setFiles,
      captionRef,
      handleSubmit,
    }),
    [files, setFiles, captionRef, handleSubmit]
  )

  return (
    <CreatePostContext.Provider value={contextValue}>
      <CreateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </CreatePostContext.Provider>
  )
}
