"use client"
import React, { useMemo } from "react"
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
import { UserAPI } from "@/service/api/UserAPI"
import { useInfiniteScroll } from "@heroui/use-infinite-scroll"
import { User as UserType } from "@/types/schema"
import ActiveToggle from "./ActiveToggle"
import VerifiedToggle from "./VerifiedToggle"
import { useInfiniteQuery } from "@tanstack/react-query"
import { QueryKey } from "@/domain/enums/QueryKey"
import { Formater } from "@/lib/Formater"
export const columns = [
  { name: "NAME", uid: "fullName" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "isActive" },
  { name: "VERIFICATION", uid: "isVerified" },
  { name: "JOIN AT", uid: "join_date" },
  { name: "ACTIONS", uid: "actions" },
]

export default function UserList() {
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery({
      queryKey: [QueryKey.GET_USERS],
      queryFn: async ({ pageParam }) => await UserAPI.getUsers(pageParam ?? ""),
      initialPageParam: "",

      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

  const allItems = useMemo<UserType[]>(
    () => data?.pages.flatMap((page) => page.list) ?? [],
    [data]
  )

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    onLoadMore: () => {
      void fetchNextPage() // call it without awaiting
    },
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
      case "join_date":
        return <div>{Formater.formatDate(user.createdAt)}</div>
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
        hasNextPage ? (
          <div className="flex w-full justify-center">
            <Spinner ref={loaderRef} color="white" />
          </div>
        ) : null
      }
      classNames={{
        base: "max-h-[600px]",
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
        isLoading={isFetchingNextPage}
        items={allItems}
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
