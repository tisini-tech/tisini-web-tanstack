import { StreamFixture } from '#/components/streams/stream-fixture'
import { fixtureDetailsQueryOptions } from '#/data/scores'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/streams/$fixType/fixtures/$fixId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { fixType, fixId } = Route.useParams()
  const { data } = useSuspenseQuery(fixtureDetailsQueryOptions(fixId))

  return (
    <section className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-4 sm:p-6">
      <StreamFixture
        fixture={data.fixture}
        fixtureType={fixType}
        withActions
        linkable={false}
      />
    </section>
  )
}
