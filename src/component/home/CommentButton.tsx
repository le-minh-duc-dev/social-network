import React from "react"
import FullPostModal from "../fullPostModal/FullPostModal"
import { Button, useDisclosure } from "@heroui/react"
import { FaRegComment } from "react-icons/fa"
import { Post } from "@/types/schema"

export default function CommentButton({ post }: Readonly<{ post: Post }>) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button isIconOnly variant="light" onPress={onOpen}>
        <FaRegComment className="text-2xl -scale-x-100" />
      </Button>
      <FullPostModal isOpen={isOpen} onClose={onClose} post={post} />
    </>
  )
}
