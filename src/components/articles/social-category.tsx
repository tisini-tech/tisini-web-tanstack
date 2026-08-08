const socials = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/1DSYvEevcC/',
    className:
      'bg-[#1877F2]/15 text-[#1877F2] border-[#1877F2]/25 hover:bg-[#1877F2]/25',
    icon: FacebookIcon,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/tisini',
    className:
      'bg-pink-500/15 text-pink-300 border-pink-500/25 hover:bg-pink-500/25',
    icon: InstagramIcon,
  },
  {
    name: 'Youtube',
    href: 'https://www.youtube.com/@tisini5344',
    className:
      'bg-red-500/15 text-red-300 border-red-500/25 hover:bg-red-500/25',
    icon: YoutubeIcon,
  },
  {
    name: 'X',
    href: 'https://x.com/TisiniTech',
    className: 'bg-white/10 text-foreground border-white/15 hover:bg-white/15',
    icon: XIcon,
  },
] as const

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** App / livescores promo + social buttons in two columns. */
export default function SocialsWidget() {
  return (
    <div className="w-full">
      <div className="border-t-2 border-emerald-400/80">
        <div className="flex items-center justify-between py-3">
          <h2 className="font-heading text-sm font-bold tracking-wide text-emerald-300 uppercase sm:text-base">
            Stay Connected
          </h2>
        </div>
      </div>

      <div className="grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2 sm:items-stretch sm:gap-5">
        <a
          href="https://play.google.com/store/apps/details?id=com.tisini.app"
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-opacity hover:opacity-95"
        >
          <img
            src="https://i.postimg.cc/7YHmZGt2/tisini-App.gif"
            alt="Download the Tisini app for livescores"
            className="h-full min-h-48 w-full object-cover object-center"
          />
        </a>

        <div className="flex flex-col justify-center gap-2.5">
          <p className="mb-1 text-sm text-muted-foreground">
            Follow Tisini and get livescores on the app.
          </p>
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-11 items-center justify-between rounded-lg border px-4 text-sm font-semibold transition-colors ${social.className}`}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {social.name}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
