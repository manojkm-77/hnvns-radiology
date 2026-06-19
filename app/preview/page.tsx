"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

// Simple utility to combine class names (reuse existing cn if needed)
const containerClass = cn(
  "flex flex-col items-center justify-center min-h-screen py-8",
  "bg-gray-900 text-gray-100"
)

const linkClass = cn(
  "text-lg font-medium underline mb-4",
  "hover:text-teal-400 transition-colors"
)

// List of routes to preview. Adjust as new pages are added.
const routes = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/candidates", label: "Candidates" },
  { href: "/contact", label: "Contact" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/insights", label: "Insights" },
  { href: "/jobs", label: "Jobs" },
  { href: "/services", label: "Services" },
]

export default function PreviewPage() {
  return (
    <main className={containerClass}>
      <h1 className="text-3xl font-bold mb-8">Page Preview</h1>
      <div className="flex flex-col items-start">
        {routes.map((r) => (
          <Link key={r.href} href={r.href} className={linkClass}>
            {r.label}
          </Link>
        ))}
      </div>
    </main>
  )
}
