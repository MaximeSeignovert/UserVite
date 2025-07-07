import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { LayoutProvider } from '../components/LayoutProvider'
import { AuthProvider } from '../providers/AuthProvider'
import '../styles.css'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <LayoutProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </LayoutProvider>
    </AuthProvider>
  ),
})