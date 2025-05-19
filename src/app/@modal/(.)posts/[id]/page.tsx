import { RouteProtector } from "@/auth/RouteProtector"
import SinglePost from "@/component/SinglePost"
import { AppRouteManager } from "@/service/AppRouteManager"
import { PostService } from "@/service/PostService"
import { Types } from "mongoose"
import { redirect } from "next/navigation"

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await RouteProtector.protect()
  const postId = (await params).id
  let postObjectId
  try {
    postObjectId = new Types.ObjectId(postId)
  } catch (error) {
    console.log(error)
    redirect(AppRouteManager.HOME)
  }
  const postService = new PostService()

  const post = await postService.getPostById(postObjectId)

  return <SinglePost post={post}/>
}
