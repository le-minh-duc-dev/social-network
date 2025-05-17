export const AppRouteManager = {
  HOME: "/",
  ADMIN: "/admin",
  ADMIN_MANAGE_USERS: "/admin/manage-users",
  userDetails: (userId: string) => "/admin/manage-users/" + userId,
  LOGIN: "/login",
  REGISTER: "/register",
  WELCOME_NEW_MEMBER: "/welcome-new-member",
  REELS: "/reels",
  profile: (userId: string) => "/profile?userId=" + userId,
  saved: (userId: string) =>
    AppRouteManager.profile(userId) + "&queryTab=" + "saved",
  posts: (postId: string) => "/posts/" + postId,
  USER_SETTINGS_EDIT_PROFILE: "/user-settings/edit-profile",
  USER_SETTINGS_PRIVACY: "/user-settings/privacy",
  EXPLORE: "/explore",
}
