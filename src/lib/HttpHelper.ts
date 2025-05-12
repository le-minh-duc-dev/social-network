import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"

export class HttpHelper {
  static buildHttpErrorResponseData(
    status: HttpStatus,
    error?: string
  ): IResponse<string> {
    return {
      status,
      errors: [error ?? HttpMessages[status]],
    }
  }
}
