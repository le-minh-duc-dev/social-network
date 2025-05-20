"use client"
import React, { useState, useEffect, useRef, TouchEvent } from "react"
import { MediaItem } from "@/types/schema"
import { MediaType } from "@/domain/enums/MediaType"
import { Button, Image } from "@heroui/react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import { LocalStorageService } from "@/service/LocalStorageService"
import { ExternalStorageServiceKey } from "@/domain/enums/ExternalStorageServiceKey"
import { VolumnType } from "@/domain/enums/VolumeType"
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io"
import Video from "./Video"

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

  //volume
  const [hasSound, setHasSound] = useState(false)

  const nextSlide = () => setCurrent((prev) => (prev + 1) % mediaList.length)
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + mediaList.length) % mediaList.length)

  const currentX = useRef<number>(0)
  const handleTouchStart = (e: TouchEvent) => {
    currentX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const touchX = e.changedTouches[0].clientX
    const diffX = currentX.current - touchX

    if (diffX > 50 && current < mediaList.length - 1) {
      nextSlide()
    } else if (diffX < -50 && current > 0) {
      prevSlide()
    }
  }

  useEffect(() => {
    const externalStorageService = new LocalStorageService()
    const soundSetting = externalStorageService.getItem(
      ExternalStorageServiceKey.VOLUME_SETTINGS
    )
    if (soundSetting) {
      if (soundSetting == VolumnType.ON) {
        setHasSound(true)
      } else {
        setHasSound(false)
      }
    }
  }, [])

  function toggleVolume() {
    setHasSound(!hasSound)
    const externalStorageService = new LocalStorageService()
    externalStorageService.saveItem(
      ExternalStorageServiceKey.VOLUME_SETTINGS,
      hasSound ? VolumnType.OFF : VolumnType.ON
    )
  }

  return (
    <div
      className={"relative  flex items-center justify-center " + widthAndAspect}
    >
      <div
        key={current}
        className=" bg-black w-full max-h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {mediaList[current].type === MediaType.IMAGE ? (
          <Image
            src={mediaList[current].url}
            alt="slide"
            className={"object-cover rounded-none " + itemWidthHeight}
          />
        ) : (
          <>
            <Video
              src={mediaList[current].url}
              autoPlayOnView
              loop
              muted={!hasSound}
              className={"object-cover " + itemWidthHeight}
              controls={false}
            />
            {/* <video
              ref={videoRef}
              src={mediaList[current].url}
              className={"object-cover " + itemWidthHeight}
              muted={!hasSound}
              loop 
            />*/}
            <Button
              variant="light"
              isIconOnly
              className="absolute bottom-4 right-2"
              onPress={toggleVolume}
            >
              {hasSound ? <IoMdVolumeHigh /> : <IoMdVolumeOff />}
            </Button>
          </>
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
        {mediaList.length > 1 &&
          mediaList.map((_, idx) => (
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
