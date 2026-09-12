import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/streams/$fixType')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen w-full bg-[#39FF14] text-white">
      <Outlet />
    </div>
  )
}
