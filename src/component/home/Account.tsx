import { Skeleton, User } from "@heroui/react"
import React from "react"
import { useAuth } from "../provider/auth/AuthContext"
import { AppRouteManager } from "@/service/AppRouteManager"
import Link from "next/link"
import { MdVerified } from "react-icons/md"
import { signOut } from "next-auth/react"

export default function Account() {
  const { authUser, isLoading } = useAuth()
  return (
    <div className="w-60">
      <div className="flex  justify-between">
        <User
          avatarProps={{
            src: authUser?.avatarUrl,
            className: "w-10 h-10 ",
          }}
          name={
            isLoading ? (
              <Skeleton className="w-32 h-4 rounded-xl" />
            ) : (
              <div className="flex items-center gap-x-1">
                <Link
                  href={AppRouteManager.profile(authUser?.id ?? "")}
                  className="font-semibold"
                >
                  {authUser?.username ?? authUser?.name}
                </Link>
                {authUser?.isVerified && (
                  <MdVerified className="text-blue-500" />
                )}
              </div>
            )
          }
          description={authUser?.name}
        />
        <button
          className="text-blue-400 hover:underline text-xs z-10"
          onClick={() => {
            signOut({ redirectTo: AppRouteManager.LOGIN })
          }}
        >
          Switch
        </button>
      </div>
      <p className="text-sm text-default-500 mt-6">
        © 2025 Social Network Inc.
      </p>
    </div>
  )
}
