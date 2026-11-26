
import { useCallback, useEffect, useMemo, useState } from 'react'

import { VideoToolApi} from '#/lib/video-tool-api'
import { MergeVideos } from './merge-videos'
import { ToolsTabs } from './tools-tabs'
import { DownloadVideos } from './download-videos'
import type {
  VideoSession,
  UsageLimit,
  UsageLimits,
} from '#/lib/types'

type ToolsTab = 'merge' | 'download'


type ToolsContentProps = {
  session: VideoSession
}

function formatReset(value?: number | string) {
  if (value === undefined) {
    return null
  }

  if (typeof value === 'string') {
    return value
  }

  if (!Number.isFinite(value)) {
    return null
  }

  if (value <= 0) {
    return 'Soon'
  }

  const days = Math.floor(value / 86400)
  const hours = Math.floor((value % 86400) / 3600)
  const minutes = Math.floor((value % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}

function UsageCard({
  title,
  limit,
}: {
  title: string
  limit?: UsageLimit
}) {
  const remaining =
    typeof limit?.left === 'number' ? limit.left : null

  const reset = formatReset(limit?.resets_in)

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-2 text-3xl font-semibold tabular-nums">
        {remaining ?? '—'}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {reset ? `Resets in ${reset}` : 'Reset information unavailable'}
      </p>
    </div>
  )
}

export function ToolsContent({ session }: ToolsContentProps) {
  const [activeTab, setActiveTab] = useState<ToolsTab>('merge')
  const [limits, setLimits] = useState<UsageLimits | null>(null)
  const [limitsLoading, setLimitsLoading] = useState(true)
  const [limitsError, setLimitsError] = useState('')

  const api = useMemo(() => new VideoToolApi(session), [session])

 const refreshLimits = useCallback(async () => {
  setLimitsLoading(true)
  setLimitsError('')

  try {
    const result = await api.getLimits()
    setLimits(result)
  } catch (error) {
    setLimitsError(
      error instanceof Error
        ? error.message
        : 'Could not load usage limits.',
    )
  } finally {
    setLimitsLoading(false)
  }
}, [api])

  useEffect(() => {
    void refreshLimits()
  }, [refreshLimits])

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Video Tools
        </h1>

        <p className="text-muted-foreground">
          Merge videos and download content from YouTube.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Your usage</h2>

         <button
          type="button"
          onClick={() => void refreshLimits()}
          disabled={limitsLoading}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={limitsLoading ? 'animate-spin' : ''}>↻</span>
          {limitsLoading ? 'Refreshing...' : 'Refresh limits'}
        </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <UsageCard
            title="Merge jobs remaining"
            limit={limits?.merge}
          />

          <UsageCard
            title="Download jobs remaining"
            limit={limits?.basic}
          />
        </div>

        {limitsError && (
          <p className="text-sm text-destructive">
            Could not load usage limits: {limitsError}
          </p>
        )}
      </div>

      <ToolsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <section
        role="tabpanel"
        aria-label={
          activeTab === 'merge'
            ? 'Merge videos'
            : 'Download videos'
        }
      >
        {activeTab === 'merge' ? (
          <MergeVideos
            session={session}
            onJobCreated={refreshLimits}
          />
        ) : (
          <DownloadVideos
            session={session}
            onJobCreated={refreshLimits}
          />
        )}
      </section>
    </div>
  )
}
