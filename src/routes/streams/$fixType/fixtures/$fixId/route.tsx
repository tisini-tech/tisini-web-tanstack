import { fixtureDetailsQueryOptions } from '#/data/scores'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/streams/$fixType/fixtures/$fixId')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      fixtureDetailsQueryOptions(params.fixId),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
