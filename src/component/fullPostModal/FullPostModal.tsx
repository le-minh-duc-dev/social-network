import React from "react"
import { Post as PostType } from "@/types/schema"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import FullPost from "./FullPost"
import { Button } from "@heroui/react"
import { IoMdClose } from "react-icons/io"
import { useRouter } from "next/navigation"
import Post from "../home/Post"

export default function FullPostModal({
  isOpen,
  onClose,
  post,
  showCloseBtn,
}: Readonly<{
  isOpen: boolean
  onClose: () => void
  post: PostType | null
  showCloseBtn?: boolean
}>) {
  const router = useRouter()
  if (!post) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 md:bg-black/75 bg-black" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel>
          {showCloseBtn && (
            <Button
              isIconOnly
              radius="full"
              className="fixed top-2 lg:top-8 right-2 lg:right-8 z-50"
              variant="flat"
              onPress={() => router.back()}
            >
              <IoMdClose className="text-lg" />
            </Button>
          )}
          <div className="hidden lg:block">
            <FullPost post={post} />
          </div>
          <div className="lg:hidden w-full md:w-[450px] xl:w-[450px] bg-black">
            <Post post={post} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
