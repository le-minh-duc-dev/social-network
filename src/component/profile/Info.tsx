import { UserAPI } from "@/service/api/UserAPI"
import { Avatar, Button } from "@heroui/react"
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
    queryKey: [QueryKey.GET_USERS,"SINGLE", userId],
    queryFn: async () => await UserAPI.getUserById(userId),
    enabled: !!userId,
  })

  const user = data?.data
  if (isLoading) {
    return <div className="h-full">Loading...</div>
  }
  return (
    <div className="mt-12 flex gap-x-20 items-start">
      <Avatar src={user?.avatarUrl} alt="Your avatar" className="w-32 h-32" />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-x-6">
          <div className="text-xl font-bold flex  items-center gap-x-2">
            {user?.fullName}{" "}
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
        <div className="flex gap-x-4 mt-2">
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-foreground">
              {user?.postsCount ?? 0}
            </span>{" "}
            posts
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-foreground">
              {user?.followersCount}
            </span>{" "}
            followers
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-foreground">
              {user?.followingCount}
            </span>{" "}
            following
          </p>
        </div>
      </div>
    </div>
  )
}
