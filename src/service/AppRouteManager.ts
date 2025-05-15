export const AppRouteManager = {
  HOME: "/",
  ADMIN: "/admin",
  ADMIN_MANAGE_USERS: "/admin/manage-users",
  LOGIN: "/login",
  WELCOME_NEW_MEMBER: "/welcome-new-member",
  SEARCH: "/search",
  REELS: "/reels",
  NOTIFICATION: "/notification",
  profile: (userId: string) => "/profile?userId=" + userId,
  saved: (userId: string) =>
    AppRouteManager.profile(userId) + "&queryTab=" + "saved",
  posts: (postId: string) => "/posts/" + postId,
  USER_SETTINGS: "/user-settings",
  EXPLORE: "/explore",
}
