import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { UserService } from "@/service/UserService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // await RouteProtector.protect()

  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get("username")
  const email = searchParams.get("email")

  if (!username && !email) {
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  const user = await ServerSideAuthService.getAuthUser()
  console.log("user exists check", username, email, user?.username)

  if (user != null && (username === user?.username || email === user?.email)) {
    return Response.json({
      exists: false,
    })
  }

  //connect to the database
  await connectDB()

  //post service
  const userService = new UserService()

  let field: "username" | "email"
  let value: string
  if (username) {
    field = "username"
    value = username
  } else {
    field = "email"
    value = email!
  }

  const result = await userService.existsBy(field, value)
  console.log("result********************************", result)

  return Response.json({
    exists: result,
  })
}
