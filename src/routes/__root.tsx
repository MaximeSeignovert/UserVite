import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { LayoutProvider } from '../components/LayoutProvider'
import '../styles.css'

export const Route = createRootRoute({
  component: () => (
    <LayoutProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </LayoutProvider>
  ),
})