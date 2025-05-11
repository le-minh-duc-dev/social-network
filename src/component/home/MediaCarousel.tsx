import React, { useState, useRef, useEffect } from "react"
import { MediaItem } from "@/types/schema"
import { MediaType } from "@/domain/enums/MediaType"
import { Button, Image } from "@heroui/react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"

export default function MediaCarousel({
  mediaList,
  widthAndAspect = "w-full aspect-[9/13]",
  itemWidthHeight = "w-full h-auto",
}: Readonly<{
  mediaList: MediaItem[]
  widthAndAspect?: string
  itemWidthHeight?: string
}>) {
  const [current, setCurrent] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const nextSlide = () => setCurrent((prev) => (prev + 1) % mediaList.length)
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + mediaList.length) % mediaList.length)

  useEffect(() => {
    if (mediaList[current].type === MediaType.VIDEO && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }, [current, mediaList])

  return (
    <div
      className={"relative  flex items-center justify-center " + widthAndAspect}
    >
      <div key={current} className=" bg-black w-full max-h-full flex items-center justify-center">
        {mediaList[current].type === MediaType.IMAGE ? (
          <Image
            src={mediaList[current].url}
            alt="slide"
            className={"object-cover rounded-none " + itemWidthHeight}
          />
        ) : (
          <video
            ref={videoRef}
            src={mediaList[current].url}
            className={"object-cover " + itemWidthHeight}
            controls
            muted
          />
        )}
      </div>

      {current != 0 && (
        <Button
          isIconOnly
          variant="light"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl z-50"
          onPress={prevSlide}
        >
          <FaAngleLeft />
        </Button>
      )}

      {current != mediaList.length - 1 && (
        <Button
          isIconOnly
          variant="light"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl z-50"
          onPress={nextSlide}
        >
          <FaAngleRight />
        </Button>
      )}

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {mediaList.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full ${
              idx === current ? "bg-white" : "bg-gray-500"
            } cursor-pointer`}
          />
        ))}
      </div>
    </div>
  )
}
