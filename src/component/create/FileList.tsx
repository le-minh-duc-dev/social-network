import { Image } from "@heroui/react"
import React, { useMemo } from "react"

export default function FileList({ files }: { files: File[] }) {
  const filePreviews = useMemo(() => {
    return files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video",
    }))
  }, [files])

  if (filePreviews.length <= 0) return null
  return (
    <div className="mt-6">
      <h4 className="font-semibold text-gray-700 mb-2">Selected Files</h4>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filePreviews.map((file, idx) => (
          <li key={idx} className="flex flex-col items-center">
            {file.type === "image" ? (
              <Image
                src={file.preview}
                alt={file.name}
                className="aspect-square w-full object-cover rounded-lg"
              />
            ) : (
              <video
                src={file.preview}
                className="aspect-square w-full rounded-lg object-cover"
                controls
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
