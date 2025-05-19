"use client"
import ExplorePostList from "./ExplorePostList"
import { MARGIN_LEFT_ACCORDING_TO_SIDEBAR_WITH } from "@/domain/enums/SidebarWidth"
import { Input } from "@heroui/react"
import Link from "next/link"
import { AppRouteManager } from "@/service/AppRouteManager"

export default function Explore() {
  return (
    <div
      className={`${MARGIN_LEFT_ACCORDING_TO_SIDEBAR_WITH}   h-full grid grid-cols-5 md:mt-10`}
    >
      <div className="col-span-1 hidden lg:block"></div>
      <div className="lg:col-span-3 col-span-5 p-4 lg:p-0">
        <Link href={AppRouteManager.SEARCH} className=" my-4 mb-6 md:hidden block">
          {" "}
          <Input
            isClearable
            className="w-full"
            placeholder="Search"
            type="text"
            readOnly
          />
        </Link>
        <ExplorePostList />
      </div>
      <div className="col-span-1 hidden lg:block"></div>
    </div>
  )
}
