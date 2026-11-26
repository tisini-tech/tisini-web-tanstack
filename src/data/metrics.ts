
import type { Metric } from '#/lib/types'
import { apiService } from '#/lib/api'
import { createServerFn } from '@tanstack/react-start'
import { queryOptions } from '@tanstack/react-query'

// Metrics whose details should not appear in the glossary.
const HIDE_DETAILS_FOR = new Set<string | number>([
  256,
])

// Metrics that should not be exposed to the browser.
const HIDE_METRICS_FOR = new Set<string | number>([
  277, 278, 279, 280, 281, 282, 283,
])

export const getMetrics = createServerFn({ method: 'GET' })
  .validator((data: { fixtureType: string }) => data)
  .handler(async ({ data }) => {
    const params = new URLSearchParams({
      fixture_type: data.fixtureType,
      with_details: 'true',
    })

    const path = `/metrics?${params.toString()}`

    const metrics = await apiService.get<Metric[]>(path, {
      target: 'quiz',
      withApiKey: true,
    })

    return metrics
      .filter((metric) => !HIDE_METRICS_FOR.has(metric.id))
      .map((metric) => {
        if (HIDE_DETAILS_FOR.has(metric.id)) {
          return {
            ...metric,
            details: [],
          }
        }

        return metric
      })
  })

export const metricsQueryOptions = (fixtureType: string) =>
  queryOptions({
    queryKey: ['metrics', fixtureType],
    queryFn: () => getMetrics({ data: { fixtureType } }),
  })
