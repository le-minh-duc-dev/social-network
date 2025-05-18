import React from "react"
import { Post } from "@/types/schema"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import FullPost from "./FullPost"
import { Button } from "@heroui/react"
import { IoMdClose } from "react-icons/io"
import { useRouter } from "next/navigation"

export default function FullPostModal({
  isOpen,
  onClose,
  post,
  showCloseBtn,
}: Readonly<{
  isOpen: boolean
  onClose: () => void
  post: Post | null
  showCloseBtn?: boolean
}>) {
  const router = useRouter()
  if (!post) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/75" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel>
          {showCloseBtn && (
            <Button
              isIconOnly
              radius="full"
              className="fixed top-8 right-8 z-50"
              variant="flat"
              onPress={() => router.back()}
            >
              <IoMdClose className="text-lg" />
            </Button>
          )}
          <FullPost post={post} />
        </DialogPanel>
      </div>
    </Dialog>
  )
}
