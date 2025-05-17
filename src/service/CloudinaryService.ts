import { IMediaService } from "@/types/media_service"
import { v2 } from "cloudinary"

export class CloudinaryService implements IMediaService {
  static getUploadPresetByCloudStorage(cloudStorage: CloudStorageTypes) {
    return cloudStorage == "default"
      ? process.env.CLOUDINARY_PRESET
      : process.env.CLOUDINARY_PRESET_V2
  }

  static getApiKeyByCloudStorage(cloudStorage: CloudStorageTypes) {
    return cloudStorage == "default"
      ? process.env.CLOUDINARY_KEY
      : process.env.CLOUDINARY_KEY_V2
  }

  static getApiNameByCloudStorage(cloudStorage: CloudStorageTypes) {
    return cloudStorage == "default"
      ? process.env.CLOUDINARY_CLOUD_NAME
      : process.env.CLOUDINARY_CLOUD_NAME_v2
  }

  static getApiSecretByCloudStorage(cloudStorage: CloudStorageTypes) {
    return cloudStorage == "default"
      ? process.env.CLOUDINARY_SECRET
      : process.env.CLOUDINARY_SECRET_V2
  }

  static getConfigByCloudStorage(cloudStorage: CloudStorageTypes) {
    return {
      api_key: this.getApiKeyByCloudStorage(cloudStorage),
      api_secret: this.getApiSecretByCloudStorage(cloudStorage),
      cloud_name: this.getApiNameByCloudStorage(cloudStorage),
      secure: true,
    }
  }

  static getConfig(url: string) {
    const cloudName = this.extractCloudName(url)
    const apiKey =
      cloudName == process.env.CLOUDINARY_CLOUD_NAME
        ? process.env.CLOUDINARY_KEY
        : process.env.CLOUDINARY_KEY_V2
    const apiSecret =
      cloudName == process.env.CLOUDINARY_CLOUD_NAME
        ? process.env.CLOUDINARY_SECRET
        : process.env.CLOUDINARY_SECRET_V2
    return {
      secure: true,
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    }
  }
  //
  async deleteImageByURL(url: string) {
    if (!url) return
    const publicId = CloudinaryService.extractPublicId(url)
    v2.config(CloudinaryService.getConfig(url))
    await v2.api.delete_resources([publicId])
  }

  async deleteImagesByURLs(urls: string[]) {
    if (urls.length === 0) return
    await Promise.all(
      urls.map((url) => {
        const publicId = CloudinaryService.extractPublicId(url)
        v2.config(CloudinaryService.getConfig(url))
        return v2.api.delete_resources([publicId])
      })
    )
  }

  async deleteVideosByURLs(urls: string[]) {
    if (urls.length === 0) return
    await Promise.all(
      urls.map((url) => {
        const publicId = CloudinaryService.extractPublicId(url)
        v2.config(CloudinaryService.getConfig(url))
        return v2.api.delete_resources([publicId], {
          type: "upload",
          resource_type: "video",
        })
      })
    )
  }
  async deleteMediaByURLs(urls: string[]) {
    const imagePublicUrls: string[] = urls.filter(
      (url) => CloudinaryService.getTypeFileOfUrl(url) == "image"
    )
    const videoPublicUrls: string[] = urls.filter(
      (url) => CloudinaryService.getTypeFileOfUrl(url) == "video"
    )
    await this.deleteImagesByURLs(imagePublicUrls)
    await this.deleteVideosByURLs(videoPublicUrls)
  }

  static getTypeFileOfUrl(url: string) {
    let ext: string | string[] | undefined = url.split(".")

    ext = ext.pop()?.toLowerCase()
    if (ext) {
      // Video file extensions
      if (["mp4", "mov", "avi", "mkv"].includes(ext)) {
        return "video"
      }
      // Image file extensions
      else if (
        ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "webp"].includes(
          ext
        )
      ) {
        return "image"
      }
    }

    return "unknown"
  }
  static extractPublicId(cloudinarySecureUrl: string) {
    if (!cloudinarySecureUrl) return ""
    const parts = cloudinarySecureUrl.split("/")
    if (parts.length < 2) return ""

    const extractedPart =
      parts[parts.length - 2] + "/" + parts[parts.length - 1].split(".")[0]
    return extractedPart
  }

  static extractCloudName(cloudinarySecureUrl: string) {
    if (!cloudinarySecureUrl) return ""
    const parts = cloudinarySecureUrl.split("/")
    if (parts.length < 4) return ""
    return parts[3]
  }

  static isCloudinaryUrl(url: string) {
    if (!url) return false
    return url.startsWith("https://res.cloudinary.com/")
  }
}
