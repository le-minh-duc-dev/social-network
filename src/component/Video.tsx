import React, { useRef, useEffect, VideoHTMLAttributes } from "react"

interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /** Autoplay only when in view (true = like Instagram reels) */
  autoPlayOnView?: boolean
  /** Callback when video starts playing */
  onView?: () => void
  /** Callback when video pauses */
  onPause?: () => void
  /** Threshold for viewport detection (0.6 = 60% visible) */
  threshold?: number
  /** Wrapper className (for layout or styling) */
  wrapperClassName?: string
}

const Video: React.FC<VideoProps> = ({
  autoPlayOnView = true,
  onView,
  onPause,
  threshold = 0.6,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!autoPlayOnView) return

    const video = videoRef.current
    if (!video) return

    let hasViewed = false

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(console.warn)
          if (!hasViewed && onView) {
            onView()
            hasViewed = true
          }
        } else {
          video.pause()
          if (onPause) onPause()
        }
      },
      { threshold }
    )

    observerRef.current.observe(video)

    return () => {
      if (observerRef.current && video) {
        observerRef.current.unobserve(video)
      }
    }
  }, [autoPlayOnView, threshold, onView, onPause])

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      {...props}
      className={props.className ?? "w-full h-auto object-cover"}
    />
  )
}

export default Video
