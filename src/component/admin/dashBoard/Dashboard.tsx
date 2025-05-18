"use client"

import React from "react"
import { addToast, Button } from "@heroui/react"
import { AiOutlineClear } from "react-icons/ai"
import { FaRegComment, FaRegHeart } from "react-icons/fa"
import { IoDocumentTextOutline, IoPeopleSharp } from "react-icons/io5"
import { SiChainlink } from "react-icons/si"

import { clearCache } from "@/actions/admin/clearCache"
import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import PostsOverviewChart from "./PostsOverviewChart"

interface CacheClearButtonProps {
  label: string
  icon: React.ReactNode
  cacheKey: UnstableCacheKey | "ALL"
  width?: string
  height?: string
}

function CacheClearButton({
  label,
  icon,
  cacheKey,
  width = "300px",
  height = "100px",
}: Readonly<CacheClearButtonProps>) {
  const handleClick = () => {
    clearCache(cacheKey).then(() => {
      addToast({ title: "Cache cleared successfully", color: "success" })
    })
  }

  return (
    <Button
      className="text-2xl rounded-3xl"
      style={{ width, height }}
      startContent={icon}
      variant="flat"
      color="danger"
      onPress={handleClick}
    >
      {label}
    </Button>
  )
}

export default function Dashboard() {
  const buttons: CacheClearButtonProps[] = [
    {
      label: "Clear All cache",
      icon: <AiOutlineClear className="text-5xl" />,
      cacheKey: "ALL",
      width: "300px",
      height: "100px",
    },
    {
      label: "Clear users cache",
      icon: <IoPeopleSharp className="text-5xl" />,
      cacheKey: UnstableCacheKey.USER_LIST,
    },
    {
      label: "Clear posts cache",
      icon: <IoDocumentTextOutline className="text-5xl" />,
      cacheKey: UnstableCacheKey.POST_LIST,
    },
    {
      label: "Clear comments cache",
      icon: <FaRegComment className="text-5xl" />,
      cacheKey: UnstableCacheKey.POST_COMMENT_LIST,
      width: "350px",
    },
    {
      label: "Clear likes cache",
      icon: <FaRegHeart className="text-5xl" />,
      cacheKey: UnstableCacheKey.POST_LIKE_LIST,
    },
    {
      label: "Clear follows cache",
      icon: <SiChainlink className="text-5xl" />,
      cacheKey: UnstableCacheKey.USER_FOLLOW,
    },
  ]

  return (
    <div className="mt-24 mx-24">
      <div className="w-[75%] h-96">
        <PostsOverviewChart />
      </div>
      <div className="mt-12">
        <h2 className="text-2xl mb-12">Actions</h2>
        <div className="flex gap-4 flex-wrap items-center border py-8 px-8 border-white/15 rounded-3xl">
          {buttons.map(({ label, icon, cacheKey, width, height }) => (
            <CacheClearButton
              key={label}
              label={label}
              icon={icon}
              cacheKey={cacheKey}
              width={width}
              height={height}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
