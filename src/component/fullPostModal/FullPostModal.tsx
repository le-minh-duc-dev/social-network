import React from "react"
import { Post } from "@/types/schema"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import FullPost from "./FullPost"

export default function FullPostModal({
  isOpen,
  onClose,
  post,
}: Readonly<{ isOpen: boolean; onClose: () => void; post: Post | null }>) {
  if (!post) return null
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/75" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel>
          <FullPost post={post} />
        </DialogPanel>
      </div>
    </Dialog>
  )
}
