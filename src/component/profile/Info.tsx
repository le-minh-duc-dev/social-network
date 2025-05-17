import { UserAPI } from "@/service/api/UserAPI"
import { Avatar, Button, Skeleton } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { QueryKey } from "@/domain/enums/QueryKey"
import { MdVerified } from "react-icons/md"
import { useProfileContext } from "./ProfileContext"
import { useAuth } from "@/component/provider/auth/AuthContext"
import FollowButton from "../FollowButton"
import { AppRouteManager } from "@/service/AppRouteManager"
import { useRouter } from "next/navigation"

export default function Info() {
  const { authUser } = useAuth()
  const { userId } = useProfileContext()
  const router = useRouter()

  const isSameUser = authUser?.id === userId

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.GET_USERS, "SINGLE", userId],
    queryFn: async () => await UserAPI.getUserById(userId),
    enabled: !!userId,
  })

  const user = data?.data

  //skeleton
  if (isLoading) {
    return (
      <div className="mt-12 flex gap-x-20 items-start">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-x-6">
            <div className="text-xl font-bold flex  items-center gap-x-2">
              <Skeleton className="w-40 h-8 rounded-xl" />
            </div>
            <Skeleton className="w-24 h-10 rounded-xl" />
          </div>
          <div className="flex gap-x-4 mt-4">
            <Skeleton className="text-gray-500  w-14 h-4 rounded-xl" />
            <Skeleton className="text-gray-500  w-20 h-4 rounded-xl" />
            <Skeleton className="text-gray-500  w-20 h-4 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="mt-12 flex gap-x-20 items-start">
      <Avatar src={user?.avatarUrl} alt="Your avatar" className="w-36 h-36" />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-x-6">
          <div className="text-xl font-bold flex  items-center gap-x-2">
            {user?.username ?? user?.fullName}{" "}
            {user?.isVerified && (
              <MdVerified className="text-blue-500 inline-block" />
            )}
          </div>
          {isSameUser ? (
            <Button
              onPress={() =>
                router.push(AppRouteManager.USER_SETTINGS_EDIT_PROFILE)
              }
            >
              Edit profile
            </Button>
          ) : (
            <FollowButton followingId={userId} />
          )}
        </div>
        <div className="flex gap-x-4 mt-6">
          <p className="text-gray-500 text-base">
            <span className="font-semibold text-foreground">
              {user?.postsCount ?? 0}
            </span>{" "}
            posts
          </p>
          <p className="text-gray-500 text-base">
            <span className="font-semibold text-foreground">
              {user?.followersCount}
            </span>{" "}
            followers
          </p>
          <p className="text-gray-500 text-base">
            <span className="font-semibold text-foreground">
              {user?.followingCount}
            </span>{" "}
            following
          </p>
        </div>
        <div className="mt-6">
          <div className="font-semibold">{user?.fullName}</div>
          <div className=" text-sm mt-2 border-b pb-2 w-fit">{user?.bio}</div>
        </div>
      </div>
    </div>
  )
}
