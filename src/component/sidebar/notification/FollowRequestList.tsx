import { toggleFollowAccept } from "@/actions/follow/toggleFollowAccept"
import { InfiniteVirtualList } from "@/component/InfiniteVirtualList"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { FollowAPI } from "@/service/api/FollowAPI"
import { AppRouteManager } from "@/service/AppRouteManager"
import { User as UserType } from "@/types/schema"
import { addToast, Button, Spinner, User } from "@heroui/react"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import React from "react"
import { MdVerified } from "react-icons/md"

const FETCH_SIZE = 10

export default function FollowRequestList({
  setIsOpen,
}: Readonly<{
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>) {
  const queryClient = useQueryClient()
  const handleAccept = async (userId: string, username: string) => {
    await toggleFollowAccept(userId, true)
      .then((res) => {
        if (res.status == HttpStatus.NO_CONTENT) {
          queryClient.invalidateQueries({
            queryKey: [QueryKey.GET_USERS],
            exact: false,
          })

          queryClient.invalidateQueries({
            queryKey: [QueryKey.GET_POSTS],
            exact: false,
          })
          addToast({ title: "Follow request accepted for: " + username })
        }
      })
      .catch((err) => {
        console.error(err)
        addToast({ title: "Error accepting follow request for: " + username })
      })
  }
  return (
    <InfiniteVirtualList<UserType>
      queryKey={[QueryKey.GET_USERS, "FOLLOW", "REQUESTING"]}
      fetchFn={async (pageParam: string) => {
        return await FollowAPI.getFollows(
          pageParam,
          FETCH_SIZE,
          "followers",
          false
        )
      }}
      renderItem={(user) => (
        <div className=" hover:bg-default-100  p-4 rounded-xl flex items-center justify-between">
          <Link
            href={AppRouteManager.profile(user._id.toString())}
            className="  "
            onClick={() => {
              setIsOpen(false)
            }}
          >
            <User
              avatarProps={{
                src: user.avatarUrl,
              }}
              name={
                <div className="flex items-center gap-x-1">
                  <p className="font-semibold">
                    {user.username ?? user.fullName}
                  </p>
                  {user.isVerified && <MdVerified className="text-blue-500" />}
                </div>
              }
              description={user.fullName}
            />
          </Link>
          <Button
            color="primary"
            onPress={() => handleAccept(user._id.toString(), user.username)}
          >
            Accept
          </Button>
        </div>
      )}
      Skeleton={LoadingComponent}
      EmptyComponent={EmptyComponent}
      staleTime={QueryStaleTime[QueryKey.GET_POST_COMMENTS]}
    />
  )
}

function LoadingComponent() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Spinner />
    </div>
  )
}

function EmptyComponent() {
  return <p className="text-center text-gray-500">No result</p>
}
