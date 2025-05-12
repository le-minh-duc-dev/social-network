export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  // Add more as needed
}

// HttpMessages.ts
export const HttpMessages: Record<HttpStatus, string> = {
  [HttpStatus.OK]: "Request succeeded.",
  [HttpStatus.CREATED]: "Resource created successfully.",
  [HttpStatus.NO_CONTENT]: "",
  [HttpStatus.BAD_REQUEST]: "Invalid request data.",
  [HttpStatus.UNAUTHORIZED]: "You are not authenticated.",
  [HttpStatus.FORBIDDEN]: "You don’t have rights to do this action.",
  [HttpStatus.NOT_FOUND]: "Resource not found.",
  [HttpStatus.CONFLICT]: "Conflict occurred.",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "Something went wrong. Please try later!",
}
