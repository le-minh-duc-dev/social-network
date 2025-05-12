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
import EditPost from "../postMutation/EditPost"
import { AppRoute } from "@/domain/enums/AppRoute"
import DeletePost from "./DeletePost"

function copyToClipboard(text: string): void {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Copied to clipboard!")
    })
    .catch((err) => {
      console.error("Failed to copy:", err)
    })
}

export default function PostOption({ post }: Readonly<{ post: Post }>) {
  const { authUser } = useAuth()
  const author = post?.author as User
  const isPostAuthor = authUser?.id == author._id.toString()

  const postUrl = AppRoute.POSTS + `/${post._id.toString()}`
  const fullPostUrl = process.env.NEXT_PUBLIC_BASE_URL + postUrl

  const {
    isOpen: isEditPostOpen,
    onOpen: onEditPostOpen,
    onOpenChange: onEditPostOpenChange,
    onClose: onEditPostClose,
  } = useDisclosure()

  const {
    isOpen: isDeletePostOpen,
    onOpen: onDeletePostOpen,
    onOpenChange: onDeletePostOpenChange,
    onClose: onDeletePostClose,
  } = useDisclosure()

  return (
    <>
      <DeletePost
        postId={post._id.toString()}
        isOpen={isDeletePostOpen}
        onOpenChange={onDeletePostOpenChange}
        onClose={onDeletePostClose}
      />
      <EditPost
        post={post}
        isOpen={isEditPostOpen}
        onOpenChange={onEditPostOpenChange}
        onClose={onEditPostClose}
      />

      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <IoIosMore className="text-xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="copyLink"
            onPress={() => copyToClipboard(fullPostUrl)}
          >
            Copy link
          </DropdownItem>
          <DropdownItem key="goToPost" href={postUrl}>
            Go to post
          </DropdownItem>
          {!isPostAuthor ? null : (
            <DropdownItem key="edit" onPress={onEditPostOpen}>
              Edit
            </DropdownItem>
          )}
          {isPostAuthor ? null : (
            <DropdownItem
              key="unfollow"
              className="text-danger font-bold"
              color="danger"
            >
              <span className="font-bold">Unfollow</span>
            </DropdownItem>
          )}
          {!isPostAuthor ? null : (
            <DropdownItem
              key="delete"
              className="text-danger font-bold"
              color="danger"
              onPress={onDeletePostOpen}
            >
              <span className="font-bold">Delete</span>
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}
