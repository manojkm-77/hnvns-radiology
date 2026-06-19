"use client"

import React, { useEffect, useRef } from "react"
import { Button } from "@/components/ui/Button"

interface DotLottieCTAProps {
  src: string
  href?: string
  label?: string
  size?: number
}

export default function DotLottieCTA({ src, href = "/contact", label = "Schedule a staffing review", size = 40, iconOnly = false }: DotLottieCTAProps & { iconOnly?: boolean }) {
  const mounted = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (mounted.current) return
    mounted.current = true

    const existing = document.querySelector('script[data-dotlottie-player]')
    if (existing) return

    const s = document.createElement("script")
    s.src = "https://unpkg.com/@lottiefiles/dotlottie-player/dist/dotlottie-player.js"
    s.async = true
    s.setAttribute("data-dotlottie-player", "1")
    document.body.appendChild(s)

    return () => {
      // keep the script to avoid reloads across navigations
    }
  }, [])

  if (iconOnly) {
    return (
      <Button href={href} className="p-0 h-12 w-12 rounded-full flex items-center justify-center" aria-label={label}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore: dotlottie-player web component */}
        <dotlottie-player src={src} style={{ width: size, height: size }} loop autoplay aria-hidden />
      </Button>
    )
  }

  return (
    <Button href={href} className="inline-flex items-center gap-3">
      <span className="-ml-1 block h-10 w-10 flex-shrink-0">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore: dotlottie-player web component */}
        <dotlottie-player
          src={src}
          style={{ width: size, height: size }}
          loop
          autoplay
          aria-hidden
        />
      </span>
      <span>{label}</span>
    </Button>
  )
}

