import { createFileRoute } from '@tanstack/react-router'
import { getFixtureDates } from '#/data/scores'

export const Route = createFileRoute('/livescores/$fixtureType/')({
  loader: async ({ params }) => {
    const { fixtureType } = params

    if (!fixtureType) {
      throw new Error('Fixture type is required')
    }

    const fixtureDates = await getFixtureDates({
      data: { fixType: fixtureType },
    })

    return {
      fixtureDates,
      fixtureType,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { fixtureType, fixtureDates } = Route.useLoaderData()

  console.log(fixtureDates)

  return <div>Hello "/livescores/${fixtureType}/"!</div>
}
