import React from "react"
import { Post } from "@/types/schema"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react"
import MediaCarousel from "../home/MediaCarousel";
export default function FullPostModal({
  isOpen,
  onClose,
  post,
}: Readonly<{ isOpen: boolean; onClose: () => void; post: Post }>) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[70vw] h-[90vh] bg-black space-y-4  grid grid-cols-5 border ">
            <div className="col-span-3 overflow-hidden">
                <MediaCarousel mediaList={post.media} widthAndAspect="h-full overflow-hidden" itemWidthHeight="h-full w-auto overflow-hidden"/>
            </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
