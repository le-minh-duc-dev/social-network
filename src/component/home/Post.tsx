import { Formater } from "@/lib/Formater"
import { Post as PostType, User as UserType } from "@/types/schema"
import { Button, User } from "@heroui/react"
import React from "react"
import { IoIosMore } from "react-icons/io"
import MediaCarousel from "./MediaCarousel"

export default function Post({ post }: { post: PostType }) {
  const author: UserType = post.author as UserType
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <User
          avatarProps={{
            src: author.avatarUrl,
          }}
          description={Formater.formatDate(post.createdAt)}
          name={author.fullName}
        />
        <Button isIconOnly variant="light">
          <IoIosMore className="text-xl" />
        </Button>
      </div>
      <div className=" overflow-hidden mt-4 rounded-lg border border-white/25">
        <div className="">
          <MediaCarousel mediaList={post.media} />
        </div>
      </div>
    </div>
  )
}
