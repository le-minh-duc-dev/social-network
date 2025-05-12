"use client"
import { useAuth } from "@/hooks/useAuth"
import { Post, User } from "@/types/schema"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react"
import { IoIosMore } from "react-icons/io"
import EditPost from "./postMutation/EditPost"

export default function PostOption({ post }: Readonly<{ post: Post }>) {
  const { authUser } = useAuth()
  const author = post?.author as User
  const isPostAuthor = authUser?._id == author._id

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  return (
    <>
      <EditPost
        post={post}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <IoIosMore className="text-xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="copyLink">Copy link</DropdownItem>
          {isPostAuthor ? null : (
            <DropdownItem key="edit" onPress={onOpen}>
              Edit
            </DropdownItem>
          )}
          <DropdownItem
            key="unfollow"
            className="text-danger font-bold"
            color="danger"
          >
            <span className="font-bold">Unfollow</span>
          </DropdownItem>
          {isPostAuthor ? null : (
            <DropdownItem
              key="delete"
              className="text-danger font-bold"
              color="danger"
            >
              <span className="font-bold">Delete</span>
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}
