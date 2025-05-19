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
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaRegComment,
} from "react-icons/fa"
import { PiShareFat } from "react-icons/pi"
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io"
import { LocalStorageService } from "@/service/LocalStorageService"
import { ExternalStorageServiceKey } from "@/domain/enums/ExternalStorageServiceKey"
import { VolumnType } from "@/domain/enums/VolumeType"
import MobileCommentList from "../home/MobileCommentList"

export default function ReelVideo({
  post,
  isOpenCommentList,
  toggleCommentList,
  currentIndex,
  handleChangeIndex,
}: Readonly<{
  post?: Post
  isOpenCommentList: boolean
  toggleCommentList?: () => void
  currentIndex: number
  handleChangeIndex: (direction: "up" | "down") => void
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
    <div className="aspect-[9/16] lg:h-screen w-screen md:w-[75vw] md:h-[90vh] lg:w-auto flex items-center justify-center lg:p-6 relative ">
      {post && (
        <div className="  md:translate-x-0 right-2 md:right-4 lg:-right-8 bottom-12 absolute flex flex-col gap-y-2   gap-x-2  md:w-auto z-10">
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
              className="rounded-full hidden lg:flex"
              variant="flat"
              color={isOpenCommentList ? "primary" : "default"}
              onPress={toggleCommentList}
            >
              <FaRegComment className="text-2xl -scale-x-100" />
            </Button>

            <MobileCommentList post={post}>
              {({ onOpen }) => (
                <Button
                  isIconOnly
                  className="rounded-full lg:hidden "
                  variant="flat"
                  onPress={onOpen}
                >
                  <FaRegComment className="text-2xl -scale-x-100" />
                </Button>
              )}
            </MobileCommentList>

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
          <div className="absolute top-8 right-6">
            <Button
              variant="light"
              isIconOnly
              className=" text-lg z-10 "
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
            className="object-cover w-full h-full md:rounded-xl"
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
      {post && (
        <div className=" flex-col gap-y-8 absolute md:-right-12 lg:-right-8 right-2 flex">
          <Button
            isIconOnly
            variant="light"
            className="group"
            onPress={() => handleChangeIndex("up")}
            isDisabled={currentIndex == 0}
          >
            <FaChevronCircleUp className="text-xl opacity-60  group-hover:opacity-100" />
          </Button>

          <Button
            isIconOnly
            variant="light"
            className="group"
            onPress={() => handleChangeIndex("down")}
          >
            <FaChevronCircleDown className="text-xl opacity-60  group-hover:opacity-100" />
          </Button>
        </div>
      )}
    </div>
  )
}
