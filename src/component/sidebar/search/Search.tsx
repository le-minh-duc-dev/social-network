import { Input } from "@heroui/react"
import React, { useRef, useState } from "react"
import SearchResultList from "./SearchResultList"
import { useOutsideClick } from "@/hooks/useOutsideClick"

export default function Search({
  setIsSearchOpen,
}: Readonly<{
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}>) {
  const timeOutRef = useRef<NodeJS.Timeout | null>(null)
  const [searchKey, setSearchKey] = useState<string>("")

  const ref = useOutsideClick<HTMLDivElement>(() => setIsSearchOpen(false))

  const handleSearch = (value: string) => {
    console.log(value)
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    timeOutRef.current = setTimeout(() => {
      setSearchKey(value)
    }, 1000)
  }
  return (
    <div
      ref={ref}
      className="absolute ml-[99%] h-full flex flex-col w-96 pr-4 top-0 rounded-tr-xl rounded-br-xl border-r bg-black border-r-white/15"
    >
      <h2 className="mt-12 text-xl font-semibold">Search</h2>
      <Input
        isClearable
        className="w-full mt-8"
        placeholder="Search"
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="flex-1 flex mt-8 overflow-hidden pb-6">
        <SearchResultList
          searchKey={searchKey}
          setIsSearchOpen={setIsSearchOpen}
        />
      </div>
    </div>
  )
}
