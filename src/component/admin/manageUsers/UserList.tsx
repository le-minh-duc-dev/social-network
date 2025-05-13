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
  Chip,
  Tooltip,
  Spinner,
  SortDescriptor,
} from "@heroui/react"
import { FaRegEye } from "react-icons/fa"
import { TbMoodEdit } from "react-icons/tb"
import { MdDeleteForever } from "react-icons/md"
import { UserAPI } from "@/service/UserAPI"
import { useInfiniteScroll } from "@heroui/use-infinite-scroll"
import { useAsyncList } from "@react-stately/data"
import { User as UserType } from "@/types/schema"
export const columns = [
  { name: "NAME", uid: "fullName" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "isActive" },
  { name: "VERIFICATION", uid: "isVerified" },
  { name: "ACTIONS", uid: "actions" },
]
const statusColorMap: Partial<
  Record<
    string,
    | "success"
    | "danger"
    | "default"
    | "primary"
    | "secondary"
    | "warning"
    | undefined
  >
> = {
  active: "success",
  inactive: "danger",
}

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
    async sort({
      items,
      sortDescriptor,
    }: {
      items: unknown[]
      sortDescriptor: SortDescriptor
    }) {
      const column = sortDescriptor.column as keyof UserType

      const sorted = [...(items as UserType[])].sort((a, b) => {
        const first = a[column]!
        const second = b[column]!

        // Boolean sorting
        if (typeof first === "boolean" && typeof second === "boolean") {
          return sortDescriptor.direction === "ascending"
            ? Number(first) - Number(second)
            : Number(second) - Number(first)
        }

        // String or number sorting
        let cmp =
          (parseInt(first.toString()) || first) <
          (parseInt(second.toString()) || second)
            ? -1
            : 1

        if (sortDescriptor.direction === "descending") cmp *= -1

        return cmp
      })

      return { items: sorted }
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
            name={user.fullName}
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
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.isActive ? "active" : "inactive"]}
            size="sm"
            variant="flat"
          >
            {user.isActive ? "Active" : "Inactive"}
          </Chip>
        )
      case "isVerified":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.isVerified ? "active" : "inactive"]}
            size="sm"
            variant="flat"
          >
            {user.isVerified ? "Verified" : "Inverified"}
          </Chip>
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
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
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.uid !== "actions"} // Enable sorting for all except actions
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
