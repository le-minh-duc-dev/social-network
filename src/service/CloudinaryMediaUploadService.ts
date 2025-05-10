import { FilePreview } from "@/types/FilePreview"
import { IMediaUploadService } from "@/types/media_service"

export class CloudinaryMediaUploadService implements IMediaUploadService {
  async getSignature(
    cloudStorage: CloudStorageTypes
  ): Promise<SignatureType> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cloudStorage }),
      }
    )
    return await res.json()
  }

  async uploadFile(
    file: Blob,
    signData: SignatureType,
    cloudStorage: CloudStorageTypes = "default"
  ): Promise<string> {
    const cloudName =
      cloudStorage === "default"
        ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_v2

    const cloudPreset =
      cloudStorage === "default"
        ? process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
        : process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_V2

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
    const fd = new FormData()
    fd.append("upload_preset", cloudPreset!)
    fd.append("api_key", signData.apiKey)
    fd.append("timestamp", signData.timestamp)
    fd.append("signature", signData.signature)
    fd.append("file", file)

    try {
      const res = await fetch(url, { method: "POST", body: fd })
      const data = await res.json()
      return data.secure_url || ""
    } catch (error) {
      console.error(error)
      return ""
    }
  }

  async uploadFilePreviews(
    files: FilePreview[],
    cloudStorage: CloudStorageTypes = "default"
  ): Promise<{ success: FilePreview[]; failed: FilePreview[] }> {
    const signData = await this.getSignature(cloudStorage)

    const uploadWithRetries = async (
      file: FilePreview,
      retries = 3
    ): Promise<FilePreview> => {
      let attempt = 0
      while (attempt < retries) {
        try {
          const url = await this.uploadFile(file.file!, signData, cloudStorage)
          return { ...file, preview: url }
        } catch {
          attempt++
          if (attempt >= retries) {
            throw new Error(`Upload failed for ${file.file?.name}`)
          }
        }
      }

      throw new Error("Unexpected retry flow error")
    }

    const results = await Promise.all(
      files.map((file) =>
        uploadWithRetries(file)
          .then((res) => ({ status: "fulfilled", file: res }))
          .catch(() => ({ status: "rejected", file }))
      )
    )

    const success = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.file)

    const failed = results
      .filter((r) => r.status === "rejected")
      .map((r) => r.file)

    return { success, failed }
  }
}
