import { PortalConsumidor } from '@/features/consumidor/PortalConsumidor'
import { NotasApiProvider } from '@/features/consumidor/hooks'

export function ConsumidorPage() {
  return (
    <NotasApiProvider>
      <PortalConsumidor />
    </NotasApiProvider>
  )
}
