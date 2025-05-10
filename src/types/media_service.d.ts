import { FilePreview } from "./FilePreview";

export interface IMediaUploadService {
  getSignature(cloudStorage: CloudStorageTypes): Promise<SignatureType>

  uploadFile(
    file: Blob,
    signData: SignatureType,
    cloudStorage?: CloudStorageTypes
  ): Promise<string>

  uploadFilePreviews(
    files: FilePreview[],
    cloudStorage?: CloudStorageTypes
  ): Promise<{ success: FilePreview[]; failed: FilePreview[] }>
}

export interface IMediaService {
  deleteImageByURL(url: string): Promise<void>
  deleteImagesByURLs(urls: string[]): Promise<void>
  deleteVideosByURLs(urls: string[]): Promise<void>
  deleteMediaByURLs(urls: string[]): Promise<void>
}
