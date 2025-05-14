"use client"
import React from "react"
import ExplorePostList from "./ExplorePostList"

export default function Explore() {
  return (
    <div className="ml-[354px]  h-full grid grid-cols-5 mt-10">
      <div className="col-span-1"></div>
      <div className="col-span-3">
        <ExplorePostList />
      </div>
      <div className="col-span-1"></div>
    </div>
  )
}
