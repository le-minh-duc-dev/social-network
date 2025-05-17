import { Input } from "@heroui/react"
import React, { useRef } from "react"

export default function Search() {
  const timeOutRef = useRef<NodeJS.Timeout | null>(null)
  const handleSearch = (value: string) => {
    console.log(value)
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    timeOutRef.current = setTimeout(() => {
      console.log("searching for", value)
    }, 1000)
  }
  return (
    <div className="absolute ml-[99%] h-full w-96 pr-4 top-0 rounded-tr-xl rounded-br-xl border-r bg-black border-r-white/15">
      <h2 className="mt-12 text-xl font-semibold">Search</h2>
      <Input
        isClearable
        className="w-full mt-8"
        placeholder="Search"
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
