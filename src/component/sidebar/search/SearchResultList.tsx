import { InfiniteVirtualList } from "@/component/InfiniteVirtualList"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { UserAPI } from "@/service/api/UserAPI"
import { AppRouteManager } from "@/service/AppRouteManager"
import { User as UserType } from "@/types/schema"
import { Spinner, User } from "@heroui/react"
import Link from "next/link"
import React from "react"
import { MdVerified } from "react-icons/md"

const FETCH_SIZE = 10

export default function SearchResultList({
  searchKey,
  setIsSearchOpen,
}: Readonly<{
  searchKey: string
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}>) {
  return (
    <InfiniteVirtualList<UserType>
      queryKey={[QueryKey.GET_USERS, "SEARCH", searchKey]}
      fetchFn={async (pageParam: string) => {
        return await UserAPI.getUsers(pageParam, FETCH_SIZE, searchKey)
      }}
      renderItem={(user) => (
        <Link
          href={AppRouteManager.profile(user._id.toString())}
          className=" block hover:bg-default-100  p-4 rounded-xl "
          onClick={() => {
            setIsSearchOpen(false)
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
      )}
      Skeleton={LoadingComponent}
      EmptyComponent={EmptyComponent}
      staleTime={QueryStaleTime[QueryKey.GET_POST_COMMENTS]}
    />
  )
}

function LoadingComponent() {
  return <Spinner />
}

function EmptyComponent() {
  return <p className="text-center text-gray-500">No result</p>
}
