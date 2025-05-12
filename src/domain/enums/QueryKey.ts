export enum QueryKey {
  GET_POSTS = "GET_POSTS",
  GET_POST = "GET_POST",
  GET_USER = "GET_USER",
  GET_POST_COMMENTS = "GET_POST_COMMENTS",
  GET_POST_LIKES = "GET_POST_LIKES",
}

export const QueryStaleTime: Record<QueryKey, number> = {
  [QueryKey.GET_POSTS]: 90000,
  [QueryKey.GET_POST]: 90000,
  [QueryKey.GET_USER]: 300000,
  [QueryKey.GET_POST_COMMENTS]: 90000,
  [QueryKey.GET_POST_LIKES]: 180000,
}
