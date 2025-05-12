import AdminLayout from "@/component/admin/adminLayout/AdminLayout"
import React, { ReactNode } from "react"

export default function layout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
