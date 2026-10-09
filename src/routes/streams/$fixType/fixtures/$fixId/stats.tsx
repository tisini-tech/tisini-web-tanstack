import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { StreamMatchStats } from '#/components/streams/stream-match-stats'
import { fixtureDetailsQueryOptions } from '#/data/scores'

export const Route = createFileRoute('/streams/$fixType/fixtures/$fixId/stats')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  const { fixId, fixType } = Route.useParams()
  const { data } = useSuspenseQuery(fixtureDetailsQueryOptions(fixId))

  return <StreamMatchStats details={data} fixType={fixType} />
}
