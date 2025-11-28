import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(visiteur)/_guestLayout')({
  component: RouteComponent,
  errorComponent: () => <div>There was an error loading the guest layout.</div>,
})

function RouteComponent() {
  return <div>
    <Outlet />
  </div>
}
