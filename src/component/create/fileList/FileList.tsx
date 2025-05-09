"use client"
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
import { Button } from "@heroui/react"
import { TiDelete } from "react-icons/ti"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { TbZoomScan } from "react-icons/tb"

export default function FileList({
  files,
  setFiles,
}: {
  files: FilePreview[]
  setFiles: (files: FilePreview[]) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((item) => item.id === active.id)
      const newIndex = files.findIndex((item) => item.id === over?.id)

      const newOrder = arrayMove(files, oldIndex, newIndex)
      setFiles(newOrder)
    }
  }

  return (
    <div className="mt-6 flex-1  overflow-y-auto rounded-lg overflow-x-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <PhotoProvider>
              {files.map((file) => (
                <div key={file.id}>
                  <Button isIconOnly variant="light">
                    <TiDelete className="text-lg" />
                  </Button>
                  <PhotoView src={file.preview}>
                    <Button isIconOnly variant="light">
                      <TbZoomScan className="text-lg" />
                    </Button>
                  </PhotoView>

                  <SortableItem id={file.id} file={file} />
                </div>
              ))}
            </PhotoProvider>
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
