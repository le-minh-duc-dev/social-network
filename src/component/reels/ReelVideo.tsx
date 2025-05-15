import { Post, User as UserType } from "@/types/schema"
import React from "react"
import Video from "../Video"
import FollowButton from "../FollowButton"
import { MdVerified } from "react-icons/md"
import { useAuth } from "@/hooks/useAuth"
import { Skeleton, User } from "@heroui/react"
import Link from "next/link"
import { AppRouteManager } from "@/service/AppRouteManager"

export default function ReelVideo({ post }: Readonly<{ post?: Post }>) {
  const { authUser } = useAuth()
  const author = post?.author as UserType

  const isOwnPost = author?._id.toString() === authUser?.id
  return (
    <div className="aspect-[9/16] h-screen flex items-center justify-center p-6 relative">
      {post ? (
        <>
          <Video
            key={post._id.toString()}
            src={post.media[0].url}
            autoPlayOnView={false}
            autoPlay
            className="object-cover w-full h-full rounded-xl"
            loop={true}
          />
          <div className="absolute bottom-12 left-10">
            <User
              avatarProps={{
                src: author?.avatarUrl,
              }}
              name={
                <div className="flex items-center gap-x-1">
                  <Link
                    href={AppRouteManager.profile(author._id.toString())}
                    className="font-semibold hover:underline"
                  >
                    {author?.fullName}
                  </Link>
                  {author?.isVerified && (
                    <MdVerified className="text-blue-500" />
                  )}
                  {!isOwnPost && (
                    <FollowButton
                      followingId={author?._id.toString()}
                      className="ml-4 text-bold text-white border-white"
                      size="sm"
                      variant="bordered"
                    />
                  )}
                </div>
              }
            />
            <p>{post?.caption}</p>
          </div>
        </>
      ) : (
        <Skeleton className="w-full h-full rounded-xl" />
      )}
    </div>
  )
}
