import { Post, User as UserType } from "@/types/schema"
import React, { useState } from "react"
import Video from "../Video"
import FollowButton from "../FollowButton"
import { MdVerified } from "react-icons/md"
import { useAuth } from "@/component/provider/auth/AuthContext"
import { Button, Skeleton, User } from "@heroui/react"
import Link from "next/link"
import { AppRouteManager } from "@/service/AppRouteManager"
import Like from "../Like"
import { FaRegComment } from "react-icons/fa"
import { PiShareFat } from "react-icons/pi"
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io"
import { LocalStorageService } from "@/service/LocalStorageService"
import { ExternalStorageServiceKey } from "@/domain/enums/ExternalStorageServiceKey"
import { VolumnType } from "@/domain/enums/VolumeType"

export default function ReelVideo({
  post,
  isOpenCommentList,
  toggleCommentList,
}: Readonly<{
  post?: Post
  isOpenCommentList: boolean
  toggleCommentList?: () => void
}>) {
  const { authUser } = useAuth()
  const author = post?.author as UserType

  //volume
  const [hasSound, setHasSound] = useState(false)

  const isOwnPost = author?._id.toString() === authUser?.id
  function toggleVolume() {
    setHasSound(!hasSound)
    const externalStorageService = new LocalStorageService()
    externalStorageService.saveItem(
      ExternalStorageServiceKey.VOLUME_SETTINGS,
      hasSound ? VolumnType.OFF : VolumnType.ON
    )
  }
  return (
    <div className="aspect-[9/16] h-screen flex items-center justify-center p-6 relative">
      {post && (
        <div className=" -right-8 bottom-12 absolute flex flex-col gap-y-2">
          <div className="flex flex-col items-center">
            <Like
              postId={post._id.toString()}
              className="rounded-full"
              variant="flat"
            />
            <p className="text-sm  text-white mt-1">{post?.likeCount}</p>
          </div>
          <div className="flex flex-col items-center">
            <Button
              isIconOnly
              className="rounded-full"
              variant="flat"
              color={isOpenCommentList ? "primary" : "default"}
              onPress={toggleCommentList}
            >
              <FaRegComment className="text-2xl -scale-x-100" />
            </Button>
            <p className="text-sm  text-white mt-1">{post?.commentCount}</p>
          </div>
          <Button
            isIconOnly
            className="rounded-full"
            variant="flat"
            onPress={() => {}}
          >
            <PiShareFat className="text-2xl " />
          </Button>
        </div>
      )}
      {post ? (
        <>
          <div className="absolute top-20 right-6">
            <Button
              variant="light"
              isIconOnly
              className="absolute bottom-4 right-2 text-lg z-10 "
              onPress={toggleVolume}
            >
              {hasSound ? <IoMdVolumeHigh /> : <IoMdVolumeOff />}
            </Button>
          </div>
          <Video
            key={post._id.toString()}
            src={post.media[0].url}
            autoPlayOnView={false}
            autoPlay
            className="object-cover w-full h-full rounded-xl"
            loop={true}
            muted={!hasSound}
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
                    {author?.username ?? author?.fullName}
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
