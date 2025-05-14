import { useFullPostModal } from "@/context/FullPostContext"
import { MediaType } from "@/domain/enums/MediaType"
import { Post } from "@/types/schema"
import React from "react"
import { BiSolidCopy } from "react-icons/bi"
import { TbPhotoVideo } from "react-icons/tb"
export default function PostPreview({ post, height="h-[450px]" }: Readonly<{ post: Post,height?:string }>) {
  const { setPost } = useFullPostModal()
  const firstMedia = post.media[0]
  if (!firstMedia) {
    return (
      <button
        className="h-[450px]  pt-4 hover:opacity-85 flex justify-center items-center"
        onClick={() => setPost(post)}
      >
        <p>{post.caption}</p>
      </button>
    )
  }
  return (
    <button
      className={" overflow-hidden pt-4 hover:opacity-85 relative "+height}
      onClick={() => setPost(post)}
    >
      {" "}
      {firstMedia.type == MediaType.VIDEO ? (
        <TbPhotoVideo className="top-8 right-4 absolute text-lg" />
      ) : (
        <BiSolidCopy className="top-8 right-4 absolute text-lg" />
      )}
      {firstMedia.type == MediaType.IMAGE ? (
        <img
          src={post.media[0].url}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={post.media[0].url}
          className="w-full h-full object-cover"
          muted
        />
      )}
    </button>
  )
}
