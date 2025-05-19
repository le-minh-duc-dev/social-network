# Social Network

**Website:** [https://social.ducle.online](https://social.ducle.online) 
**Default account for guests:**
- **Email:** guest@mail.com
- **Password:** guestofduc

---

## Table of Contents

1. [Social Network](#-social-network)
2. [🌐 Overview](#-overview)
3. [🏗️ Architecture & Technologies](#️-architecture--technologies)
4. [🧩 Key Features](#-key-features)

   * [✅ Authentication & Access Control](#-authentication--access-control)
   * [📝 User-Generated Content (Posts, Comments, Likes)](#-user-generated-content-posts-comments-likes)
   * [🔁 Infinite Scrolling & Pagination](#-infinite-scrolling--pagination)
   * [🔔 Real-Time Notifications](#-real-time-notifications)
   * [🔍 Search, Explore & Saved Posts](#-search-explore--saved-posts)
   * [🛠️ Admin Features](#-admin-features)
   * [🔧 Developer Experience](#-developer-experience)
5. [📂 MongoDB Schema Models](#-mongodb-schema-models)

   * [🧑‍💻 User Model](#-user-model)
   * [📷 Post Model](#-post-model)
   * [💬 Comment Model](#-comment-model)
   * [❤️ Like Model](#-like-model)
   * [📌 Saved Model](#-saved-model)
   * [👥 Follow Model](#-follow-model)
   * [🔔 Notification Model](#-notification-model)
6. [📑 UI/UX Design](#-uiux-design)

   * [1. MediaCarousel Component](#1-mediacarousel-component)
   * [2. Reels Component](#2-reels-component)
   * [3. ReelVideo Component](#3-reelvideo-component)
7. [🔗 Core Routes](#-core-routes)

   * [Public Routes](#public-routes)
   * [User Profile Routes](#user-profile-routes)
   * [Admin Routes](#admin-routes)
   * [Programmatic Usage](#programmatic-usage)
8. [🚀 Installation Guide](#-installation-guide)
9. [🧑‍💻 Author](#-author)
---

## 🌐 **Overview**

This project is a modern **Instagram-like social media platform** built with **Next.js 15** and **MongoDB**, focused on scalability, speed, and user experience.

It supports dynamic content such as posts, reels (short-form videos), comments, likes, follow requests, saved posts, and personalized notifications. Authenticated users can interact in real time, while admins can manage user accounts and content.

---

## 🏗️ **Architecture & Technologies**

| Layer                          | Tools & Frameworks                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| **Frontend**                   | Next.js 15 App Router, Tailwind CSS, TypeScript, HeroUI                                    |
| **Authentication**             | Auth.js with Google OAuth & Custom Credentials Provider                                    |
| **Backend / API**              | Next.js Actions, Server Components, MongoDB, Mongoose                                      |
| **Data Fetching**              | @tanstack/react-query (Queries & Mutations), `refetchInterval`, `infiniteQuery`, `virtual` |
| **Form Handling & Validation** | Zod                                                                                        |
| **Realtime/Notifications**     | In-app Notification System with support for `Post`, `Comment`, `Like`, `Follow` events     |
| **Caching & Optimization**     | React Query Cache, Client State Memoization                                                |
| **UI Libraries**               | HeroUI, Headless UI                                                                        |

---

## 🧩 **Key Features**

### ✅ **Authentication & Access Control**

- **Google OAuth** and **Credentials Login/Register** via Auth.js
- Role-based access: `User` vs `Admin`
- Verified and active status checks
- Follow request approval support (private profiles)

---

### 📝 **User-Generated Content (Posts, Comments, Likes)**

- **Posts**: Photo & video uploads with captions and privacy settings (`Public`, `Followers only`, etc.)
- **Likes** and **Comments** with real-time counters
- Each post includes metadata like view count, created time, and author info

---

### 🔁 **Infinite Scrolling & Pagination**

- **Infinite Feed** with support for:

  - Dynamic pagination via `tanstack/react-query` + `tanstack/virtual`
  - Reels-style feed for videos
  - `refetchInterval` to load new posts when available

- Scroll virtualization for high performance rendering of large lists

---

### 🔔 **Real-Time Notifications**

- Custom notification system supports:

  - Likes
  - Comments
  - Follows (request and acceptance)
  - Admin updates

- Notifications stored in DB via a dedicated `Notification` model
- In-app real-time delivery & badge count

---

### 🔍 **Search, Explore & Saved Posts**

- **Full-text search** for users
- **Explore tab** with trending or suggested content
- Users can **save posts** to their private collection

---

### 🛠️ **Admin Features**

- Admin dashboard with CRUD over:
  - Users
- Role-based permissions to restrict access to sensitive functionality 

---

### 🔧 **Developer Experience**

- Written in **TypeScript** for safety and maintainability
- Modular schema design with **Mongoose interfaces**
- Uses **Next.js Actions** for colocated server logic
- Graceful error handling and rollback-safe updates
- Strongly typed with `Zod` schemas for all forms (login, register, update profile)

---

## 📂 **MongoDB Schema Models**

### 🧑‍💻 User Model

- `username`, `email`, `fullName`, `bio`, `avatarUrl`
- Role, verification, and active status
- Flags for follow approval
- Countable fields: `postsCount`, `followersCount`, `followingCount`

### 📷 Post Model

- Media (images/videos) with caption and privacy setting
- Linked to an author (User)
- Tracks `likeCount`, `commentCount`, and timestamps

### 💬 Comment Model

- Linked to a `Post` and `Author`
- Stores content and creation date

### ❤️ Like Model

- Maps users to liked posts

### 📌 Saved Model

- Users can save posts privately for future reference

### 👥 Follow Model

- Follow request/acceptance logic
- Links between `follower` and `following`
- Supports request state (`isAccepted`)

### 🔔 Notification Model

- Central system for all real-time events:

  - `type`: POST_LIKED, COMMENTED, FOLLOWED, etc.
  - Optional references to related post/comment/follow
  - `isRead` flag for UI handling

---

## 📑 UI/UX Design

- Built with **HeroUI** and **Tailwind CSS**
- Responsive layouts for feed, reels, explore, and profile
- Admin and user dashboards
- Dark/light theme ready
- Modal-based post preview and profile viewer

---

### 1. `MediaCarousel` Component

#### Purpose

A customizable carousel component to display multiple media items (images and videos) in a sliding interface.

#### Features

- **Supports Images and Videos**: Renders media based on their type (image or video).
- **Manual Slide Navigation**: Includes next and previous buttons for navigating slides.
- **Dots Indicator**: Visual dots show the current active slide and allow direct navigation.
- **Volume Control for Videos**:

  - Allows users to toggle sound on/off for videos.
  - Stores volume preferences persistently in local storage (`VolumnType.ON` or `OFF`).

- **Responsive Design**: Adjustable width and aspect ratio via props (`widthAndAspect`, `itemWidthHeight`).
- **Looping Slides**: Carousel navigation loops back at the start or end for continuous browsing.

#### Use Case

Display multiple images or videos attached to a post, letting users swipe or click arrows to view all media.

---

### 2. `Reels` Component

#### Purpose

A reels-style vertical feed that allows users to scroll through video posts infinitely, similar to TikTok or Instagram Reels.

#### Features

- **Infinite Scroll Loading**:

  - Uses React Query’s `useInfiniteQuery` to fetch paginated posts dynamically.
  - Automatically fetches next page when scrolling reaches the last item.

- **Scroll Navigation**:

  - Users scroll up/down with the mouse wheel to navigate between videos.
  - Scroll debounce prevents rapid accidental changes.

- **Video Filtering**:

  - Filters media to only show video items for reel experience.

- **Comment List Toggle**:

  - Users can open and close the comment list for the current video.

- **Navigation Buttons**:

  - Provides arrow buttons for manual navigation up/down.

- **Performance Optimization**:

  - Uses memoization (`useMemo`) to flatten and filter posts efficiently.

#### Use Case

A dedicated page where users can consume short video posts one by one by scrolling vertically.

---

### 3. `ReelVideo` Component

#### Purpose

Displays an individual video post in the reels feed with interactive social features.

#### Features

- **Video Playback**:

  - Plays a single video with loop and autoplay.
  - Sound toggle button for muting/unmuting video with persistence in local storage.

- **Post Interaction Buttons**:

  - Like button with real-time like count.
  - Comment button to toggle the comment list visibility.
  - Share button placeholder for sharing functionality.

- **User Profile Info**:

  - Displays author's avatar, username, and verification badge.
  - Username links to the author’s profile page.
  - Follow button shown when viewing posts of other users.

- **Loading Placeholder**:

  - Shows skeleton UI while the post data is loading.

#### Use Case

Render each video in the reels feed with all social interaction buttons and author info for a rich media experience.

---

## 🔗 Core Routes

The project defines a centralized routing system using the `AppRouteManager` object for cleaner navigation and maintainability.

### Public Routes

| Route                 | Description                                  |
| --------------------- | -------------------------------------------- |
| `/`                   | Home (News Feed)                             |
| `/login`              | Login page                                   |
| `/register`           | Registration page                            |
| `/welcome-new-member` | Welcome screen after successful registration |
| `/explore`            | Explore content from all users               |
| `/reels`              | Instagram-style short video feed             |
| `/posts/:postId`      | View a specific post by ID                   |

### User Profile Routes

| Route                                 | Description                    |
| ------------------------------------- | ------------------------------ |
| `/profile?userId={id}`                | View a user's profile          |
| `/profile?userId={id}&queryTab=saved` | View the saved posts of a user |
| `/user-settings/edit-profile`         | Edit your profile              |
| `/user-settings/privacy`              | Manage privacy settings        |

### Admin Routes

| Route                         | Description                           |
| ----------------------------- | ------------------------------------- |
| `/admin`                      | Admin dashboard overview              |
| `/admin/manage-users`         | User management page                  |
| `/admin/manage-users/:userId` | View and manage specific user details |

> 🔐 Some of these routes are protected and require user authentication or admin roles based on the Auth.js configuration and role-based permissions (e.g., `Role.ADMIN`).

### Programmatic Usage

All routes are programmatically accessible using the `AppRouteManager` object:

```ts
AppRouteManager.profile("abc123")
// -> "/profile?userId=abc123"

AppRouteManager.saved("abc123")
// -> "/profile?userId=abc123&queryTab=saved"

AppRouteManager.posts("xyz789")
// -> "/posts/xyz789"
```

This helps avoid hardcoding route strings and provides type safety across the codebase.

---

## 🚀 Installation Guide

Follow these steps to set up and run the **Social Network** project locally:

---

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/le-minh-duc-dev/social-network.git
cd social-network
```

---

### 2. ⚙️ Set Up Environment Variables

Create a `.env` file in the root directory with the following structure. Replace the placeholder values  with your actual credentials:

```env
# === Site Info ===
NEXT_PUBLIC_BASE_URL=https://social.ducle.online
NEXT_PUBLIC_SITE_NAME=social.ducle.online

# === MongoDB ===
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password
MONGODB_DB=ducle_db
MONGODB_URI=mongodb+srv://your_mongodb_username:your_mongodb_password@cluster0.owiio.mongodb.net/ducle_db?retryWrites=true&w=majority&appName=Cluster0

# === Authentication (NextAuth) ===
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

# === Cloudinary (Image Uploads) ===
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_PRESET=your_preset
NEXT_PUBLIC_CLOUDINARY_PRESET=your_preset

# === Email Service (Resend) ===
RESEND_API_KEY=your_resend_api_key
```

---

### 3. 🧪 Run Development Server

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

> Visit `http://localhost:3000` in your browser to view the app.

---


## 🧑‍💻 Author

**Lê Minh Đức**
Final year student at Can Tho University

* 🌐 Personal goal: Professional Java & Spring Developer
* 🧠 Passionate about clean code, scalable systems, and full-stack architecture
* ✉️ Contact: [le.minh.duc.dev@gmail.com](mailto:le.minh.duc.dev@gmail.com)