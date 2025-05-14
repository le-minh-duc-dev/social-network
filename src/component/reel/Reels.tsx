"use client"
import React from "react"

export default function Reels() {
  const videos = [
    { id: 1, url: "/videos/reel1.mp4" },
    { id: 2, url: "/videos/reel2.mp4" },
    { id: 3, url: "/videos/reel3.mp4" },
  ]

  return (
    <div className="h-screen z-0 overflow-y-scroll snap-y snap-mandatory">
      {videos.map((video) => (
        <div className="snap-start h-screen border" key={video.id}></div>
      ))}
    </div>
  )
}
