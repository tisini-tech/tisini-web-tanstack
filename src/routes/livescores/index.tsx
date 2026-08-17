import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/livescores/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6 text-sm text-muted-foreground">
      Select a sport or league to view livescores.
    </div>
  )
}
