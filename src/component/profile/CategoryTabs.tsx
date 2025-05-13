import React from "react"
import { Tab, Tabs } from "@heroui/react"
import { TfiLayoutGrid3 } from "react-icons/tfi"
import { PiFilmReel } from "react-icons/pi"
import { FaRegBookmark } from "react-icons/fa"
export default function CategoryTabs() {
  return (
    <div className="flex justify-center">
      <Tabs
        aria-label="Tabs variants"
        variant="underlined"
        classNames={{ tabList: "gap-x-12" }}
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <TfiLayoutGrid3 className="text-xs" />
              <span className="uppercase font-semibold">Posts</span>
            </div>
          }
        />
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <PiFilmReel />
              <span className="uppercase font-semibold">Reels</span>
            </div>
          }
        />
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <FaRegBookmark />
              <span className="uppercase font-semibold">Saved</span>
            </div>
          }
        />
      </Tabs>
    </div>
  )
}
