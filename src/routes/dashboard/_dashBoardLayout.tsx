import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_dashBoardLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
