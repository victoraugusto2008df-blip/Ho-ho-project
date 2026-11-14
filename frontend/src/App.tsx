import { PortalConsumidor } from '@/features/consumidor/PortalConsumidor'
import { NotasApiProvider } from '@/features/consumidor/hooks'

/**
 * Até o merge do ORD-03 (shell, rotas e `apiFetch`), o app abre direto na Tela 1 (AD-010).
 * No merge, `PortalConsumidor` passa para a rota `/consumidor` e este arquivo sai.
 */
export function App() {
  return (
    <NotasApiProvider>
      <PortalConsumidor />
    </NotasApiProvider>
  )
}

export default App
