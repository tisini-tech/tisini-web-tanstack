import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { StreamLowerThird } from '#/components/streams/stream-lower-third'
import { fixtureDetailsQueryOptions } from '#/data/scores'

export const Route = createFileRoute(
  '/streams/$fixType/fixtures/$fixId/lower-third',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { fixId, fixType } = Route.useParams()
  const { data } = useSuspenseQuery(fixtureDetailsQueryOptions(fixId))

  return <StreamLowerThird details={data} fixType={fixType} />
}
