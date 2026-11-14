import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface PortalPlaceholderProps {
  card: string
  title: string
}

/** Ocupa a área de conteúdo até o card dono da tela entregar o conteúdo real. */
export function PortalPlaceholder({ card, title }: PortalPlaceholderProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {title}
            <Badge tone="brand">{card}</Badge>
          </CardTitle>
          <CardDescription>Conteúdo em construção.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-[var(--text-secondary)]">
          Esta área será substituída pela tela do card do Kanban indicado acima.
        </CardContent>
      </Card>
    </div>
  )
}
