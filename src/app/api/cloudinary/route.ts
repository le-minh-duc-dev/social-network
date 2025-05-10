import { v2 } from "cloudinary"
import { CloudinaryService } from "@/service/CloudinaryService"
export const POST = async (req: Request) => {
  const { cloudStorage } = await req.json()
  console.log(cloudStorage)
  if (cloudStorage !== "default" && cloudStorage !== "v1") {
    return Response.json({ status: false })
  }
  const apiKey = CloudinaryService.getApiKeyByCloudStorage(cloudStorage)
  const apiName = CloudinaryService.getApiNameByCloudStorage(cloudStorage)

  v2.config(CloudinaryService.getConfigByCloudStorage(cloudStorage))

  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = v2.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset:
        CloudinaryService.getUploadPresetByCloudStorage(cloudStorage),
    },
    CloudinaryService.getApiSecretByCloudStorage(cloudStorage)!
  )
  return Response.json({
    signature: signature,
    timestamp: timestamp,
    cloudname: apiName,
    apiKey: apiKey,
  })
}
