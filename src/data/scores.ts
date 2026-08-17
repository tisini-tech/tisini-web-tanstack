import { apiService } from '#/lib/api'
import { createServerFn } from '@tanstack/react-start'

import type { FixtureDate } from '#/lib/types'

export const getFixtureDates = createServerFn({ method: 'GET' })
  .validator((data: { fixType: string }) => data)
  .handler(async ({ data }) => {
    const res = await apiService.get<FixtureDate[]>(
      `/scores/match-dates/${data.fixType}`,
      { target: 'scores' },
    )

    console.log(res)

    return res
  })
