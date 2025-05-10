import { RouteProtector } from "@/auth/RouteProtector"
import Home from "@/component/home/Home"
import { AppRoute } from "@/domain/enums/AppRoute"
import { MetaDataHelper } from "@/lib/MetaDataHelper"

export async function generateMetadata() {
  return MetaDataHelper.generateMetaData(
    "Social Network",
    "Duc Le's private social network for friends and family",
    AppRoute.HOME
  )
}

export default async function page() {
  await RouteProtector.protect()
  return <Home/>
}
