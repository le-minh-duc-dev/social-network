import { AppRoute } from "@/domain/enums/AppRoute";

export class MetaDataHelper {
  static generateMetaData(
    title: string = "Social Network - Ducle's project",
    description: string = "Le Minh Duc - Final-year IT student specializing in Java, Spring Boot, and scalable backend systems. Explore my real-time chat app, microservices projects, and full-stack development portfolio.",
    url: string = AppRoute.HOME
  ) {
    return {
      title,
      description,
      openGraph: {
        title,
        description,

        url,
        siteName: process.env.NEXT_PUBLIC_SITE_NAME,
        images: ["/images/app_icon.png"],
        locale: "vi_VN",
        type: "website",
        authors: [process.env.NEXT_PUBLIC_SITE_NAME!],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        siteId: process.env.NEXT_PUBLIC_SITE_NAME,
        creator: process.env.NEXT_PUBLIC_SITE_NAME,
        creatorId: process.env.NEXT_PUBLIC_SITE_NAME,
        images: ["/images/app_icon.png"],
      },
    }
  }
}
