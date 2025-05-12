"use client"
import { v4 as uuidv4 } from "uuid"
import { useDropzone } from "react-dropzone"
import { useEffect } from "react"
import FileList from "./fileList/FileList"
import { FilePreview } from "@/types/FilePreview"
import { MediaType } from "@/domain/enums/MediaType"
import { useMutatePostContext } from "./MutatePostContext"

export default function DropZone() {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: { "image/*": [], "video/*": [] },
      maxFiles: 20,
    })

  const { setFiles } = useMutatePostContext()

  useEffect(() => {
    setFiles((pre) => {
      const newFilePreviews: FilePreview[] = acceptedFiles.map((file) => ({
        id: uuidv4(),
        file: file as File,
        preview: URL.createObjectURL(file),
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type.startsWith("image") ? MediaType.IMAGE : MediaType.VIDEO,
      }))
      return [...pre, ...newFilePreviews]
    })
  }, [acceptedFiles,setFiles])

  return (
    <div className="w-full max-w-xl mx-auto p-6  h-full overflow-hidden flex flex-col">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        } cursor-pointer`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 text-center">
          Drag & drop files here, or{" "}
          <span className="text-blue-600 underline">click to select</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Accepted: image/video, max 20 files
        </p>
      </div>

      <FileList />
    </div>
  )
}
