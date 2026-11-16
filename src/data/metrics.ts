
import type { Metric } from '#/lib/types'
import { apiService } from '#/lib/api'
import { createServerFn } from '@tanstack/react-start'
import { queryOptions } from '@tanstack/react-query'

export const getMetrics = createServerFn({ method: 'GET' })
  .validator((data: { fixtureType: string }) => data)
  .handler(async ({ data }) => {
    const params = new URLSearchParams({
      fixture_type: data.fixtureType,
      with_details: 'true',
    })

    const path = `/metrics?${params.toString()}`

    return apiService.get<Metric[]>(path, {
      target: 'main',
    })
  })

export const metricsQueryOptions = (fixtureType: string) =>
  queryOptions({
    queryKey: ['metrics', fixtureType],
    queryFn: () => getMetrics({ data: { fixtureType } }),
  })
