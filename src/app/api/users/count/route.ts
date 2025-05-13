// app/api/posts/route.ts (App Router)
import { RouteProtector } from "@/auth/RouteProtector"
import connectDB from "@/lib/connectDB"
import { UserService } from "@/service/UserService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isVerified = searchParams.get("isVerified")

  const query: { isVerified?: boolean } = {}
  if (isVerified) {
    query.isVerified = isVerified == "true"
  }

  await RouteProtector.protect()
  //connect to the database
  await connectDB()

  //user service
  const userService = new UserService()

  //count users
  const count = await userService.countUsers(query)

  return Response.json({
    count,
  })
}
