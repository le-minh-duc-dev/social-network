import { useFullPostModal } from "@/context/FullPostContext"
import { MediaType } from "@/domain/enums/MediaType"
import { Post } from "@/types/schema"
import { Image } from "@heroui/react"
import React from "react"
export default function PostPreview({
  post,
  height = "h-[450px]",
}: Readonly<{ post: Post; height?: string }>) {
  const { setPost } = useFullPostModal()
  const firstMedia = post.media[0]
  if (!firstMedia) {
    return (
      <button
        className={"border border-white/15 pt-4 hover:opacity-85 flex justify-center items-center "+ height}
        onClick={() => setPost(post)}
      >
        <p>{post.caption}</p>
      </button>
    )
  }
  return (
    <button
      className={" overflow-hidden pt-4 hover:opacity-85 relative " + height}
      onClick={() => setPost(post)}
    >
      {" "}
      {firstMedia.type == MediaType.VIDEO ? (
        <div className="top-8 right-2 absolute text-lg invert block">
          <Image src="/images/video_icon.png" width={25} height={22} alt="" />
        </div>
      ) : (
        <div className="top-8 right-2 absolute text-lg invert block">
          <Image src="/images/stack_icon.svg" width={18} height={18} alt="" />
        </div>
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
