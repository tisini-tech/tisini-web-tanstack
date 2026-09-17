import * as React from "react"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

const socialLinks = [
  { name: "Facebook", url: "https://www.facebook.com/share/1DSYvEevcC/" },
  { name: "X", url: "https://x.com/TisiniTech" },
  { name: "Instagram", url: "https://instagram.com/tisini" },
  { name: "LinkedIn", url: "https://linkedin.com/company/tisini" },
  { name: "Youtube", url: "https://www.youtube.com/@tisini5344" },
] as const

const linkColumns = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Articles", to: "/articles" },
      { label: "Livescore", to: "/livescore" },
      { label: "Tano Bora", to: "/tano-bora" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [{ label: "Privacy Policy", to: "/privacy-policy" }],
  },
] as const

type SubscribeStatus = "idle" | "loading" | "success" | "error"

export const SiteFooter = () => {
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<SubscribeStatus>("idle")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error("Subscribe failed")
      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 4000)
    } catch {
      setStatus("error")
    }
  }

  return (
    <footer className="border-t border-border bg-background/50 py-6 text-center">
      <div className="w-full">
        <div className="flex flex-col items-center justify-between gap-6 py-4 lg:flex-row">
          <Link to="/">
            <img src="/tisini-logo.png" alt="Tisini" className="h-12 w-20 object-contain" width={80} height={48} />
          </Link>

          <p className="text-lg font-medium">Subscribe to our newsletter</p>

          <form onSubmit={handleSubscribe} className="mt-0 flex items-center gap-2">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="rounded-lg bg-white/90 px-4 py-2 text-black placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "rounded-lg bg-emerald-500 px-4 py-2 text-white transition-colors hover:bg-emerald-600",
                status === "loading" && "cursor-not-allowed opacity-70"
              )}
            >
              {status === "loading" ? "Sending…" : "Subscribe"}
            </button>
          </form>
        </div>
        <p className="text-sm" role="status" aria-live="polite">
          {status === "success" && <span className="text-emerald-400">Thanks — check your inbox to confirm.</span>}
          {status === "error" && <span className="text-red-400">Something went wrong. Try again.</span>}
        </p>

        <div className="my-6 border-t border-border" />

        <div className="grid grid-cols-2 gap-8 text-left sm:grid-cols-3">
          {linkColumns.map((column) => (
            <div key={column.heading}>
              <p className="mb-2 font-medium">{column.heading}</p>
              <ul className="flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <a href={link.to} className="text-gray-400 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Tisini —{" "}
            <a href="/contact" className="ml-1 text-emerald-400 hover:underline">
              Contact Us
            </a>
          </p>
          <div className="flex gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 transition-colors hover:text-white"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}