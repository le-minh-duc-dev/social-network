"use client"
import { useAuth } from "@/component/provider/auth/AuthContext"
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
import { AppRouteManager } from "@/service/AppRouteManager"
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
type hiddenItemsType = "edit" | "delete" | "unfollow" | "goToPost"
export default function PostOption({
  post,
  hiddenItems = [],
}: Readonly<{ post: Post; hiddenItems?: hiddenItemsType[] }>) {
  const { authUser } = useAuth()
  const author = post?.author as User
  const isPostAuthor = authUser?.id == author._id.toString()

  const postUrl = AppRouteManager.posts(post._id.toString())
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

  const isHidden = (item: hiddenItemsType) => {
    if (!hiddenItems) return false
    return hiddenItems.includes(item)
  }
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
          {!isHidden("goToPost") ? (
            <DropdownItem key="goToPost" href={postUrl}>
              Go to post
            </DropdownItem>
          ) : null}
          {isPostAuthor && !isHidden("edit") ? (
            <DropdownItem key="edit" onPress={onEditPostOpen}>
              Edit
            </DropdownItem>
          ) : null}
          {!isPostAuthor && !isHidden("unfollow") ? (
            <DropdownItem
              key="unfollow"
              className="text-danger font-bold"
              color="danger"
            >
              <span className="font-bold">Unfollow</span>
            </DropdownItem>
          ) : null}
          {isPostAuthor && !isHidden("delete") ? (
            <DropdownItem
              key="delete"
              className="text-danger font-bold"
              color="danger"
              onPress={onDeletePostOpen}
            >
              <span className="font-bold">Delete</span>
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}
