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
import { AppRoute } from "@/domain/enums/AppRoute"

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Copied to clipboard!');
    })
    .catch((err) => {
      console.error('Failed to copy:', err);
    });
}


export default function PostOption({ post }: Readonly<{ post: Post }>) {
  const { authUser } = useAuth()
  const author = post?.author as User
  const isPostAuthor = authUser?._id == author._id

  const postUrl = AppRoute.POSTS + `/${post._id.toString()}`
  const fullPostUrl = process.env.NEXT_PUBLIC_BASE_URL + postUrl

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
          <DropdownItem key="copyLink" onPress={()=>copyToClipboard(fullPostUrl)}>Copy link</DropdownItem>
          <DropdownItem
            key="goToPost"
            href={postUrl}
          >
            Go to post
          </DropdownItem>
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
