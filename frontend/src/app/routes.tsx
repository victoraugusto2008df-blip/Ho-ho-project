import { Navigate, Outlet, type RouteObject } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { RequireRole } from '@/features/auth/RequireRole'
import { ACESSO_PATH, EXPIRADO_PATH, PERFIS } from '@/features/auth/types'
import { useAuthStatus } from '@/features/auth/useAuth'
import { ConsumidorPage } from '@/pages/ConsumidorPage'
import { LojistaPage } from '@/pages/LojistaPage'
import { ShoppingPage } from '@/pages/ShoppingPage'
import { AcessoPage } from './AcessoPage'
import { B2BShell } from './B2BShell'
import { ConsumidorShell } from './ConsumidorShell'

export function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

/** `/` e qualquer rota desconhecida: vai para a tela do perfil, ou para o acesso. */
export function HomeRedirect() {
  const auth = useAuthStatus()
  if (auth.status === 'valid') return <Navigate to={PERFIS[auth.session.role].rota} replace />
  return <Navigate to={auth.status === 'expired' ? EXPIRADO_PATH : ACESSO_PATH} replace />
}

export const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: ACESSO_PATH, element: <AcessoPage /> },
      {
        path: PERFIS.CONSUMIDOR.rota,
        element: (
          <RequireRole role="CONSUMIDOR">
            <ConsumidorShell />
          </RequireRole>
        ),
        children: [{ index: true, element: <ConsumidorPage /> }],
      },
      {
        path: PERFIS.LOJISTA.rota,
        element: (
          <RequireRole role="LOJISTA">
            <B2BShell />
          </RequireRole>
        ),
        children: [{ index: true, element: <LojistaPage /> }],
      },
      {
        path: PERFIS.ADMIN_SHOPPING.rota,
        element: (
          <RequireRole role="ADMIN_SHOPPING">
            <B2BShell />
          </RequireRole>
        ),
        children: [{ index: true, element: <ShoppingPage /> }],
      },
      { path: '*', element: <HomeRedirect /> },
    ],
  },
]
