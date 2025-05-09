"use client"

import React, { useMemo } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import SortableItem from "./SortableItem"

export default function FileList({
  files,
  setFiles,
}: {
  files: File[]
  setFiles: (files: File[]) => void
}) {
  const previews = useMemo<FilePreview[]>(() => {
    return files.map((file, idx) => ({
      id: idx.toString(),
      file,
      preview: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type.startsWith("image") ? "image" : "video",
    }))
  }, [files])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = previews.findIndex((item) => item.id === active.id)
      const newIndex = previews.findIndex((item) => item.id === over?.id)

      const newOrder = arrayMove(files, oldIndex, newIndex)
      setFiles(newOrder)
    }
  }

  return (
    <div className="mt-6 flex-1  overflow-y-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={previews.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((file) => (
              <SortableItem key={file.id} id={file.id} file={file} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
