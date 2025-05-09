import { useSortable } from '@dnd-kit/sortable';
import { Image } from '@heroui/react';
import React from 'react'
import { CSS } from "@dnd-kit/utilities"

export default function SortableItem({ id, file }: { id: string; file: FilePreview }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center cursor-move"
    >
      {file.type === "image" ? (
        <Image
          src={file.preview}
          alt={file.file.name}
          className="aspect-square w-full object-cover rounded-lg"
        />
      ) : (
        <video
          src={file.preview}
          className="aspect-square w-full object-cover rounded-lg"
          controls
        />
      )}
    </li>
  )
}