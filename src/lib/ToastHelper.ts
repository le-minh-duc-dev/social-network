import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { addToast } from "@heroui/react"

export class ToastHelper {
  static makeMutationErrorToast() {
    return addToast({
      title: HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
      color: "danger",
    })
  }
}
