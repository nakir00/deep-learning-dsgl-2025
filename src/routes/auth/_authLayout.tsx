import { Outlet, createFileRoute } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'

export const Route = createFileRoute('/auth/_authLayout')({
  component: RouteComponent,
  errorComponent: () => <div>There was an error loading the auth layout.</div>,
})

function RouteComponent() {
  return (
    <div>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
