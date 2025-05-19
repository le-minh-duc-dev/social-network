"use client"
import React from "react"
import ExplorePostList from "./ExplorePostList"
import { MARGIN_LEFT_ACCORDING_TO_SIDEBAR_WITH } from "@/domain/enums/SidebarWidth"

export default function Explore() {
  return (
    <div
      className={`${MARGIN_LEFT_ACCORDING_TO_SIDEBAR_WITH}   h-full grid grid-cols-5 mt-10`}
    >
      <div className="col-span-1 hidden lg:block"></div>
      <div className="lg:col-span-3 col-span-5 p-4 lg:p-0">
        <ExplorePostList />
      </div>
      <div className="col-span-1 hidden lg:block"></div>
    </div>
  )
}
