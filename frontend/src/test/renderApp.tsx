import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import { routes as appRoutes } from '@/app/routes'

interface RenderAppOptions {
  path?: string
  /** JWT já guardado na sessão antes de o app montar. */
  token?: string
  routes?: RouteObject[]
}

/** Monta o app inteiro (rotas, sessão, TanStack Query) numa rota inicial. */
export function renderApp({ path = '/acesso', token, routes = appRoutes }: RenderAppOptions = {}) {
  if (token !== undefined) sessionStorage.setItem('hoho.session', JSON.stringify({ token }))
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  const view = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { ...view, router, queryClient, user }
}

export function currentPath(router: { state: { location: { pathname: string; search: string } } }) {
  return router.state.location.pathname + router.state.location.search
}
