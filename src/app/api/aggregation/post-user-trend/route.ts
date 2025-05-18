// app/api/posts/route.ts (App Router)
import { RouteProtector } from "@/auth/RouteProtector"
import { Role } from "@/domain/enums/Role"
import connectDB from "@/lib/connectDB"
import { AggregationService } from "@/service/AggregationService"

export async function GET() {
  await RouteProtector.protect(Role.ADMIN)

  //connect to the database
  await connectDB()

  //post service
  const aggregationService = new AggregationService()

  //get posts
  const result = await aggregationService.getDailyStats()

  return Response.json(result)
}
