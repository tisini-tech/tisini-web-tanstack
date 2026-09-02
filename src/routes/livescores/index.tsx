import { createFileRoute, redirect } from '@tanstack/react-router'
import { DEFAULT_FIXTURE_TYPE } from '@/lib/scores'

export const Route = createFileRoute('/livescores/')({
  beforeLoad: () => {
    throw redirect({
      to: '/livescores/$fixtureType',
      params: { fixtureType: DEFAULT_FIXTURE_TYPE },
      replace: true,
    })
  },
})
