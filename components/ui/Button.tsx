"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

const variants = {
  primary: "bg-accent border-accent text-black hover:bg-accent/90",
  outline: "border-border text-muted hover:border-white/40 hover:text-white",
  ghost: "border-transparent text-muted hover:text-white",
}

type Variant = keyof typeof variants

type BaseButtonProps = {
  variant?: Variant
  className?: string
  href?: string
  children: React.ReactNode
}

type ButtonProps = BaseButtonProps & (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
)

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
      <Link href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
