import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { cn } from "@/lib/utils"


export const Route = createFileRoute("/contact" as unknown as "/")({
  component: ContactsSection,
  head: () => ({
    meta: [
      { title: "Contact Us | Tisini" },
      {
        name: "description",
        content: "Get in touch with the Tisini team. We'd love to hear from you.",
      },
    ],
  }),
})

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

type SubmitStatus = "idle" | "loading" | "success" | "error"

const contactMethods = [
  { label: "Email", value: "info@tisini.africa", href: "mailto:info@tisini.africa" },
  { label: "Phone", value: "+254 791 047878", href: "tel:+254791047878" },
  { label: "Location", value: "Nairobi, Kenya", href: undefined },
]

const initialForm: ContactFormData = { name: "", email: "", subject: "", message: "" }

export function ContactsSection() {
  const [form, setForm] = React.useState<ContactFormData>(initialForm)
  const [status, setStatus] = React.useState<SubmitStatus>("idle")
  const [errorMsg, setErrorMsg] = React.useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (status === "error") {
      setStatus("idle")
      setErrorMsg("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Failed to send message")

      setStatus("success")
      setForm(initialForm)
      setTimeout(() => setStatus("idle"), 4000)
    } catch {
      setStatus("error")
      setErrorMsg("Something went wrong. Please try again or email us directly.")
    }
  }

  const inputBase =
    'w-full border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-pitch focus:outline-none dark:focus:border-emerald-500'

  return (
    <main className="flex-1">
      <section className="w-full py-20 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-5 lg:gap-12">
          {/* ─── Left: statement, not a hedge ─── */}
          <div className="lg:col-span-2">
            <p className="font-mono text-xs tracking-widest text-pitch dark:text-emerald-400/90">GET IN TOUCH</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Tell us what you need.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-muted-foreground">
              A real person reads every message. No ticket queue, no auto-reply loop — you'll hear back within a
              day.
            </p>

            <ul className="mt-12 space-y-6 border-t border-border pt-8">
              {contactMethods.map((method) => (
                <li key={method.label} className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs tracking-wide text-muted-foreground">{method.label.toUpperCase()}</span>
                  {method.href ? (
                    <a
                      href={method.href}
                      className="text-right text-sm font-medium text-foreground transition-colors hover:text-accent-foreground"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <span className="text-right text-sm font-medium text-foreground">{method.value}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-pitch/20 bg-pitch/10 px-4 py-2 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-pitch dark:bg-emerald-400" />
              <span className="text-xs font-medium text-accent-foreground">Avg. reply time: under 24 hours</span>
            </div>
          </div>

          {/* ─── Right: the form, doing exactly one job ─── */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground">
                    FULL NAME
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground">
                  SUBJECT
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className={cn(inputBase, 'appearance-none bg-transparent')}
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Support</option>
                  <option value="media">Media &amp; Press</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground">
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className={cn(inputBase, "resize-none")}
                />
              </div>

              <div role="status" aria-live="polite">
                {status === "error" && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {errorMsg}
                  </div>
                )}
                {status === "success" && (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    Message sent. We'll be in touch soon.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                aria-busy={status === "loading"}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors",
                  "hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-background",
                  status === "loading" && "cursor-not-allowed opacity-70"
                )}
              >
                {status === "loading" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}