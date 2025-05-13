"use client"
import React, { useState } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Spinner,
} from "@heroui/react"
import { FaRegEye } from "react-icons/fa"
import { TbMoodEdit } from "react-icons/tb"
import { MdDeleteForever, MdVerified } from "react-icons/md"
import { UserAPI } from "@/service/UserAPI"
import { useInfiniteScroll } from "@heroui/use-infinite-scroll"
import { useAsyncList } from "@react-stately/data"
import { User as UserType } from "@/types/schema"
import ActiveToggle from "./ActiveToggle"
import VerifiedToggle from "./VerifiedToggle"
export const columns = [
  { name: "NAME", uid: "fullName" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "isActive" },
  { name: "VERIFICATION", uid: "isVerified" },
  { name: "ACTIONS", uid: "actions" },
]

export default function UserList() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)

  const list = useAsyncList({
    async load({ cursor }) {
      if (cursor) {
        setIsLoading(false)
      }

      const res = await UserAPI.getUsers(cursor ?? "")

      setHasMore(res.nextCursor !== null)

      return {
        items: res.list,
        cursor: res.nextCursor,
      }
    },
  })

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  })

  const renderCell = React.useCallback((user: UserType, columnKey: string) => {
    console.log("columnKey", columnKey)
    switch (columnKey) {
      case "fullName":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatarUrl }}
            description={user.email}
            name={
              <div className="flex gap-x-2 items-center">
                <div className="">{user.fullName}</div>
                {user.isVerified && <MdVerified className="text-blue-500" />}
              </div>
            }
          >
            {user.email}
          </User>
        )
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{user.role}</p>
            {/* <p className="text-bold text-sm capitalize text-default-400">
              {user.team}
            </p> */}
          </div>
        )
      case "isActive":
        return <ActiveToggle user={user} />
      case "isVerified":
        return <VerifiedToggle user={user} />
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <FaRegEye />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <TbMoodEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <MdDeleteForever />
              </span>
            </Tooltip>
          </div>
        )
    }
  }, [])

  return (
    <Table
      aria-label="Example table with custom cells"
      baseRef={scrollerRef}
      bottomContent={
        hasMore ? (
          <div className="flex w-full justify-center">
            <Spinner ref={loaderRef} color="white" />
          </div>
        ) : null
      }
      classNames={{
        base: "max-h-[600px] overflow-y-scroll",
        table: "min-h-[500px]",
      }}
      selectionMode="multiple"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={list.items as UserType[]}
        loadingContent={<Spinner color="white" />}
      >
        {(item: UserType) => (
          <TableRow key={item._id.toString()}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
