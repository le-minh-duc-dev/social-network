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
    <div className="mt-6 flex-1  overflow-y-auto">
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
            {files.map((file) => (
              <SortableItem key={file.id} id={file.id} file={file} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
