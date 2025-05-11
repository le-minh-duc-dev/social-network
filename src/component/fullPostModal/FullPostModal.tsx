import React from "react"
import { Post, User as UserType } from "@/types/schema"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import MediaCarousel from "../home/MediaCarousel"
import { Button, Divider, User } from "@heroui/react"
import { IoIosMore } from "react-icons/io"
import Comment from "./Comment"

export default function FullPostModal({
  isOpen,
  onClose,
  post,
}: Readonly<{ isOpen: boolean; onClose: () => void; post: Post }>) {
  const author: UserType = post.author as UserType

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/75" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[70vw] h-[95vh] bg-black space-y-4  grid grid-cols-5 rounded-lg ">
          <div className="col-span-3 overflow-hidden">
            <MediaCarousel
              mediaList={post.media}
              widthAndAspect="h-full overflow-hidden"
              itemWidthHeight="h-full w-auto overflow-hidden"
            />
          </div>
          <div className="col-span-2 px-4">
            <div className="flex justify-between items-center mt-2 mr-2">
              <User
                avatarProps={{
                  src: author.avatarUrl,
                  size: "sm",
                }}
                name={author.fullName}
              />
              <Button isIconOnly variant="light">
                <IoIosMore className="text-xl" />
              </Button>
            </div>
            <Divider className="my-4" />
            <div className="">
              {post.caption && (
                <Comment
                  name={author.fullName}
                  content={post.caption}
                  isComment={false}
                  avatarUrl={author.avatarUrl}
                  createdAt={post.createdAt}
                />
              )}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
