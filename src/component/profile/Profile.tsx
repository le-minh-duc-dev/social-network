"use client"

import Info from "./Info"

import CategoryTabs from "./CategoryTabs"
import PostList from "./PostList"
import { GoPlus } from "react-icons/go"
import { useMemo, useState } from "react"
import { ProfileContext } from "./ProfileContext"
import ReelList from "./ReelList"
export type TabType = "posts" | "reels" | "saved"
export default function Profile() {
  const [currentTab, setCurrentTab] = useState<TabType>("posts")

  const contextValue = useMemo(
    () => ({ currentTab, setCurrentTab }),
    [currentTab, setCurrentTab]
  )
  const tabContent = useMemo(() => {
    switch (currentTab) {
      case "posts":
        return <PostList />
      case "reels":
        return <ReelList />
      case "saved":
        return <div>Saved</div>
    }
  }, [currentTab])
  return (
    <ProfileContext.Provider value={contextValue}>
      <div className="ml-[354px]  h-full">
        <div className="flex justify-center">
          <Info />
        </div>
        <div className="flex justify-center my-12">
          <div className="w-[40%]">
            <div className="flex flex-col items-center w-fit gap-y-4">
              <div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center text-5xl text-default-500 outline outline-2 outline-offset-4 outline-default-500">
                <GoPlus />
              </div>
              <div className="text-sm">New</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center ">
          <div className="border-t border-t-white/15 pt-8 mt-8 w-[60%]">
            <CategoryTabs />

            {tabContent}
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  )
}
