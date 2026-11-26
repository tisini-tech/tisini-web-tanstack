
import type {BasicDownloadOptions,MergeSource,UsageLimits,VideoJob,VideoSession,} from '#/lib/types'

type ApiError = {
  detail?: {
    title?: string
    message?: string
    code?: string
    hint?: string
    retry_after?: number
  }
}

export class VideoToolError extends Error {
  status: number
  code?: string
  hint?: string
  retryAfter?: number

  constructor(
    message: string,
    status: number,
    details?: {
      code?: string
      hint?: string
      retryAfter?: number
    },
  ) {
    super(message)
    this.name = 'VideoToolError'
    this.status = status
    this.code = details?.code
    this.hint = details?.hint
    this.retryAfter = details?.retryAfter
  }
}

export class VideoToolApi {
  private baseUrl: string
  private token: string

  constructor(session: VideoSession) {
    this.baseUrl = session.api_url.replace(/\/+$/, '')
    this.token = session.token
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })

    let data: unknown

    try {
      data = await response.json()
    } catch {
      data = {}
    }

    if (!response.ok) {
      const error = data as ApiError
      const detail = error.detail

      throw new VideoToolError(
        detail?.message || 'The video service could not complete the request.',
        response.status,
        {
          code: detail?.code,
          hint: detail?.hint,
          retryAfter: detail?.retry_after,
        },
      )
    }

    return data as T
  }

  async getLimits() {
    return this.request<UsageLimits>('/v1/limits')
  }

  async createMergeJob(sources: MergeSource[]) {
    return this.request<{ id: string }>('/v1/jobs', {
      method: 'POST',
      body: JSON.stringify({
        tool: 'merge',
        sources,
      }),
    })
  }

  async createBasicDownload(options: BasicDownloadOptions) {
    return this.request<{ id: string }>('/v1/jobs', {
      method: 'POST',
      body: JSON.stringify({
        tool: 'basic',
        ...options,
      }),
    })
  }

  async getJob(id: string) {
    return this.request<VideoJob>(
      `/v1/jobs/${encodeURIComponent(id)}`,
    )
  }

  async cancelJob(id: string) {
    return this.request<VideoJob>(
      `/v1/jobs/${encodeURIComponent(id)}/cancel`,
      { method: 'POST' },
    )
  }

  async getDownloadUrl(id: string) {
    const result = await this.request<{ url: string }>(
      `/v1/jobs/${encodeURIComponent(id)}/link`,
      { method: 'POST' },
    )

    return new URL(result.url, this.baseUrl).toString()
  }

  async deleteUpload(id: string) {
    return this.request<void>(
      `/v1/uploads/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    )
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<{ id: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('POST', `${this.baseUrl}/v1/uploads`)
      xhr.setRequestHeader(
        'Authorization',
        `Bearer ${this.token}`,
      )
      xhr.setRequestHeader(
        'Content-Type',
        'application/octet-stream',
      )

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress?.(event.loaded / event.total)
        }
      }

      xhr.onload = () => {
        let data: { id?: string; detail?: ApiError['detail'] }

        try {
          data = JSON.parse(xhr.responseText)
        } catch {
          reject(
            new VideoToolError('Invalid upload response.', xhr.status),
          )
          return
        }

        if (xhr.status === 201 && data.id) {
          resolve({ id: data.id })
          return
        }

        reject(
          new VideoToolError(
            data.detail?.message || 'The file upload failed.',
            xhr.status,
            {
              code: data.detail?.code,
              hint: data.detail?.hint,
              retryAfter: data.detail?.retry_after,
            },
          ),
        )
      }

      xhr.onerror = () => {
        reject(new Error('The connection was interrupted during upload.'))
      }

      xhr.onabort = () => {
        reject(new Error('The upload was cancelled.'))
      }

      xhr.send(file)
    })
  }
}
