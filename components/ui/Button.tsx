"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

const variants = {
  primary: "bg-teal border-teal text-black hover:bg-teal/90",
  outline: "border-border-dark text-muted hover:border-white/40 hover:text-white",
  ghost: "border-transparent text-muted hover:text-white",
}

type Variant = keyof typeof variants

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  className?: string
  href?: string
  children: React.ReactNode
}

export function Button({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-medium transition-colors duration-300",
    variants[variant],
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
