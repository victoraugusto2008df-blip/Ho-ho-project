import { PortalConsumidor } from '@/features/consumidor/PortalConsumidor'
import { NotasApiProvider } from '@/features/consumidor/hooks'
import { LojistaApiProvider } from '@/features/lojista/hooks'
import { PortalLojista } from '@/features/lojista/PortalLojista'

/**
 * Até o merge do ORD-03 (shell, rotas e `apiFetch`), o app abre direto numa tela só: a Tela 2
 * com `?tela=lojista` (AD-018) e a Tela 1 em qualquer outro caso (AD-010).
 * No merge, `PortalConsumidor` e `PortalLojista` passam para as rotas `/consumidor` e `/lojista`
 * e este arquivo deixa de escolher por parâmetro.
 */
export function App() {
  if (new URLSearchParams(window.location.search).get('tela') === 'lojista') {
    return (
      <LojistaApiProvider>
        <PortalLojista />
      </LojistaApiProvider>
    )
  }
  return (
    <NotasApiProvider>
      <PortalConsumidor />
    </NotasApiProvider>
  )
}

export default App
