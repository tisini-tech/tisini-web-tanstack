import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from '#/lib/session'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

/**
 * Opens a video-tools session for the signed-in user, on the server, so the
 * secret key never reaches the browser. Returns null when it cannot.
 *
 * Env (server only, no VITE_ prefix):
 *   VIDEO_API_URL  e.g. http://127.0.0.1:8000
 *   VIDEO_API_KEY  the same value as VT_API_KEY on the video server
 */
export const getVideoSessionFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await useAppSession()
    const user = session.data.user
    if (!user) {
      console.error('[video] no signed-in user in the site session')
      return null
    }

    const base = process.env.VIDEO_API_URL
    const key = process.env.VIDEO_API_KEY
    if (!base || !key) {
      console.error(
        '[video] missing env:',
        base ? '' : 'VIDEO_API_URL',
        key ? '' : 'VIDEO_API_KEY',
      )
      return null
    }

    try {
      const res = await fetch(`${base.replace(/\/$/, '')}/v1/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': key },
        body: JSON.stringify({ user: String(user.id) }),
      })
      if (!res.ok) {
        console.error('[video] session refused', res.status, await res.text())
        return null
      }
      const sessionData = await res.json()

      return {
        ...sessionData,
        api_url: base.replace(/\/$/, ''),
      } as Record<string, JsonValue>
    } catch (error) {
      console.error('[video] could not reach', base, error)
      return null
    }
  },
)