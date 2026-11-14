import { LojistaApiProvider } from '@/features/lojista/hooks'
import { PortalLojista } from '@/features/lojista/PortalLojista'

export function LojistaPage() {
  return (
    <LojistaApiProvider>
      <PortalLojista />
    </LojistaApiProvider>
  )
}
