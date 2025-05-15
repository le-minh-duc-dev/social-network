import { AppRoute } from "@/domain/enums/AppRoute"
import { QueryKey } from "@/domain/enums/QueryKey"
import { UserAPI } from "@/service/api/UserAPI"
import { Button, Tooltip, User } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import React, { ReactNode, useState } from "react"
import { MdVerified } from "react-icons/md"
import FollowButton from "../FollowButton"
import { useAuth } from "@/hooks/useAuth"
import { FollowStatus } from "@/types/schema"

export default function ProfilePreview({
  children,
  userId,
}: Readonly<{ children: ReactNode; userId: string }>) {
  const { authUser } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.GET_USERS, userId],
    queryFn: async () => await UserAPI.getUserById(userId),
    enabled: !!userId,
  })

  const [followStatus, setFollowStatus] = useState<FollowStatus>("notFollowing")

  const user = data?.data
  if (isLoading) {
    return <div className="h-full">Loading...</div>
  }
  return (
    <Tooltip
      placement="bottom-start"
      classNames={{ content: "bg-black shadow shadow-white/50" }}
      content={
        <div className="px-1 py-2 w-80">
          <User
            avatarProps={{
              src: user?.avatarUrl,
              size: "lg",
            }}
            name={
              <div className="flex items-center gap-x-1">
                <Link
                  href={AppRoute.PROFILE + `?userId=${userId}`}
                  className="font-semibold"
                >
                  {user!.fullName}
                </Link>
                {user!.isVerified && <MdVerified className="text-blue-500" />}
              </div>
            }
          />
          <div className="flex gap-x-4  w-full justify-around mt-4">
            <ItemCount title="posts" count={user?.postsCount ?? 0} />
            <ItemCount title="followers" count={user?.followersCount ?? 0} />
            <ItemCount title="following" count={user?.followingCount ?? 0} />
          </div>
          {authUser?.id != userId && (
            <div className="flex w-full  mt-4 gap-x-4">
              {followStatus=="following" || followStatus=="requesting" ? (
                <Button className="flex-1" color="primary">
                  Message
                </Button>
              ) : null}
              <FollowButton
                followingId={userId}
                onChangeCallback={(flstatus) => {
                  console.log("onChangeCallback", flstatus)
                  setFollowStatus(flstatus)
                }}
                className="flex-1"
              />
            </div>
          )}
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

function ItemCount({
  title,
  count,
}: Readonly<{ title: string; count: number }>) {
  return (
    <div className="text-gray-500 flex flex-col items-center text-sm w-10">
      <div className="font-bold text-lg text-foreground">{count}</div>{" "}
      <div className="">{title}</div>
    </div>
  )
}
