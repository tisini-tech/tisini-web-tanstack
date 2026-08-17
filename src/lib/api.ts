import { useAppSession } from '@/lib/session'

// Prevent multiple refresh requests at the same time
let refreshPromise: Promise<string> | null = null

export type ApiTarget = 'main' | 'scores'

export type ApiRequestOptions = {
  /** Which backend. Default: `main` (`API_URL`). */
  target?: ApiTarget
  /**
   * Main API: also send `X-API-Key` (public endpoints).
   * Scores API: always sends the key — this flag is ignored.
   */
  withApiKey?: boolean
}

function resolveBaseUrl(target: ApiTarget) {
  if (target === 'scores') {
    const url = process.env.API_SCORES_URL
    if (!url) throw new Error('API_SCORES_URL is not set')
    return url.replace(/\/$/, '')
  }

  const url = process.env.API_URL
  if (!url) throw new Error('API_URL is not set')
  return url.replace(/\/$/, '')
}

function resolveApiKey() {
  const apiKey = process.env.API_KEY
  if (!apiKey) throw new Error('API_KEY is not set')
  return apiKey
}

function normalizeRequestOptions(
  opts: boolean | ApiRequestOptions = false,
): Required<Pick<ApiRequestOptions, 'target'>> & ApiRequestOptions {
  if (typeof opts === 'boolean') {
    return { target: 'main', withApiKey: opts }
  }
  return { target: opts.target ?? 'main', withApiKey: opts.withApiKey }
}

// Function to refresh the access token (main API only)
async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const session = await useAppSession()
    const refreshToken = session.data.refreshToken

    if (!refreshToken) {
      throw new Error('No refresh token found')
    }

    const url = resolveBaseUrl('main')

    const res = await fetch(`${url}/auth/refresh-token`, {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(
        `Failed to refresh access token: ${error.detail || 'Failed to refresh access token'}`,
      )
    }

    const data = await res.json()

    await session.update({
      ...session.data,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    })

    return data.access_token as string
  })().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  opts: boolean | ApiRequestOptions = false,
  retried = false,
): Promise<Response> {
  const { target, withApiKey } = normalizeRequestOptions(opts)
  const baseUrl = resolveBaseUrl(target)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  const session = await useAppSession()
  const accessToken = session.data.accessToken

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
    'Content-Type': 'application/json',
  }

  if (target === 'scores') {
    // Scores API is API-key only.
    headers['X-API-Key'] = resolveApiKey()
  } else {
    // Main API: bearer and/or API key.
    if (!accessToken && !withApiKey) {
      throw new Error('No access token found')
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    if (withApiKey) {
      headers['X-API-Key'] = resolveApiKey()
    }
  }

  const res = await fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers,
  })

  // Token refresh only applies to the main (session) API.
  if (
    target === 'main' &&
    res.status === 401 &&
    accessToken &&
    !retried
  ) {
    await refreshAccessToken()
    return apiFetch(path, init, opts, true)
  }

  return res
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(
      error.detail || error.message || `Request failed (${res.status})`,
    )
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export const apiService = {
  async get<T>(path: string, opts: boolean | ApiRequestOptions = false) {
    return parseResponse<T>(await apiFetch(path, { method: 'GET' }, opts))
  },

  async post<T>(
    path: string,
    data?: unknown,
    opts: boolean | ApiRequestOptions = false,
  ) {
    return parseResponse<T>(
      await apiFetch(
        path,
        { method: 'POST', body: JSON.stringify(data) },
        opts,
      ),
    )
  },

  async put<T>(
    path: string,
    data?: unknown,
    opts: boolean | ApiRequestOptions = false,
  ) {
    return parseResponse<T>(
      await apiFetch(
        path,
        { method: 'PUT', body: JSON.stringify(data) },
        opts,
      ),
    )
  },

  async patch<T>(
    path: string,
    data?: unknown,
    opts: boolean | ApiRequestOptions = false,
  ) {
    return parseResponse<T>(
      await apiFetch(
        path,
        { method: 'PATCH', body: JSON.stringify(data) },
        opts,
      ),
    )
  },

  async delete<T>(path: string, opts: boolean | ApiRequestOptions = false) {
    return parseResponse<T>(
      await apiFetch(path, { method: 'DELETE' }, opts),
    )
  },
}
