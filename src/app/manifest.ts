import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Social Network",
    short_name: "Social Network",
    description:
      "A modern Instagram-like social media platform built with Next.js 15 and MongoDB, focused on scalability, speed, and user experience.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/images/app_icon.png",
        sizes: "200x200",
        type: "image/png",
      },

      {
        src: "/images/app_icon_large.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  }
}
