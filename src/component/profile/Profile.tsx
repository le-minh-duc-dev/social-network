"use client"

import Info from "./Info"

import CategoryTabs from "./CategoryTabs"
import PostList from "./PostList"
import { GoPlus } from "react-icons/go"
import { useEffect, useMemo, useState } from "react"
import { ProfileContext } from "./ProfileContext"
import ReelList from "./ReelList"
import SavedList from "./SavedList"
import { useSearchParams } from "next/navigation"
import { MARGIN_LEFT_ACCORDING_TO_SIDEBAR_WITH } from "@/domain/enums/SidebarWidth"

export type TabType = "posts" | "reels" | "saved"
export default function Profile() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId") ?? ""
  const queryTab = searchParams.get("queryTab") as TabType | null
  const [currentTab, setCurrentTab] = useState<TabType>(queryTab ?? "posts")


  useEffect(() => {
    if (queryTab) {
      setCurrentTab(queryTab)
    }
  }, [queryTab])
  const contextValue = useMemo(
    () => ({ currentTab, setCurrentTab, userId }),
    [currentTab, setCurrentTab, userId]
  )
  const tabContent = useMemo(() => {
    switch (currentTab) {
      case "posts":
        return <PostList />
      case "reels":
        return <ReelList />
      case "saved":
        return <SavedList />
    }
  }, [currentTab])
  return (
    <ProfileContext.Provider value={contextValue}>
      <div className={`${MARGIN_LEFT_ACCORDING_TO_SIDEBAR_WITH}  flex-1 overflow-hidden`}>
        <div className="flex justify-center">
          <Info />
        </div>
        <div className="flex justify-center my-6 md:my-12">
          <div className="w-[40%]">
            <div className="flex flex-col items-center w-fit gap-y-4">
              <div className="md:w-16 md:h-16 w-8 h-8 rounded-full bg-default-100 flex items-center justify-center text-5xl text-default-500 outline outline-2 outline-offset-4 outline-default-500">
                <GoPlus />
              </div>
              <div className="text-sm">New</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center ">
          <div className="border-t border-t-white/15 pt-8 mt-8  md:w-[60%]">
            <CategoryTabs />

            {tabContent}
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  )
}
