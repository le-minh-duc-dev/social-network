import { RouteProtector } from "@/auth/RouteProtector"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { UserService } from "@/service/UserService"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id

  await RouteProtector.protect()

  let userObjectId
  try {
    userObjectId = MongooseHelper.toObjectId(userId)
  } catch (error) {
    console.error("Invalid userId:", userId, error)

    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }
  //connect to the database
  await connectDB()

  //post service
  const userService = new UserService()

  //get posts
  const user = await userService.findUserById(userObjectId)

  return Response.json({
    status: HttpStatus.OK,
    data: user,
  })
}
