# 🎨 Guia Prático do Design System — Frontend (Ho-Ho)

> **Equipe 22 — Ho-Ho** | Guia rápido de referência visual com **exemplos prontos de copiar e colar** para o **Breno (Tela 1)**, o **Walisson (Tela 2)** e o **Victor (Tela 3)** manterem a identidade visual idêntica aos mockups de [`.docs/images/`](../images/).

---

## 1. Regras de Ouro da Interface

1. **Nunca use cores hexadecimais soltas no JSX** (ex: `style={{ color: '#4F46E5' }}` ou `text-[#4F46E5]`). Use sempre as classes semânticas do projeto (`text-[var(--color-brand)]`, etc.).
2. **Proibido usar emojis como ícones na UI** (ex: 📊, 💳, 🚗). Use sempre componentes SVG da biblioteca **`lucide-react`** (ex: `<BarChart3 />`, `<CreditCard />`, `<Car />`).
3. **Sempre use a classe `tabular-nums` em números e moedas** (ex: `R$ 150,00`, `48%`, `1.420`). Isso impede que dígitos de larguras diferentes façam os cards "vibrarem" ou fiquem desalinhados.
4. **Reaproveite as primitivas prontas** de [`frontend/src/components/ui/`](../../frontend/src/components/ui/):
   * `<Button>`: botões de ação e simulação.
   * `<Card>`: contêineres brancos com borda hairline suave.
   * `<Badge>`: pílulas de status e categorias.

---

## 2. Mapa Rápido de Cores e Tokens

As variáveis estão declaradas em [`frontend/src/styles/tokens.css`](../../frontend/src/styles/tokens.css) e mapeadas no Tailwind v4 em [`frontend/src/index.css`](../../frontend/src/index.css):

| Finalidade | Variável CSS | Classe Tailwind Recomendada | Onde usar no projeto |
| :--- | :--- | :--- | :--- |
| **Fundo da Página** | `--bg-canvas` | `bg-[var(--bg-canvas)]` | Fundo principal da aplicação (`#F8FAFC`) |
| **Fundo do Card** | `--bg-surface` | `bg-[var(--bg-surface)]` | Fundo de cartões, modais e cabeçalhos (`#FFFFFF`) |
| **Bordas Suaves** | `--border-hairline` | `border-[var(--border-hairline)]` | Divisores e bordas sutis (`#E2E8F0`) |
| **Texto Principal** | `--text-primary` | `text-[var(--text-primary)]` | Títulos e números grandes (`#0F172A`) |
| **Texto Secundário** | `--text-secondary` | `text-[var(--text-secondary)]` | Subtítulos e descrições (`#475569`) |
| **Texto Esmaecido** | `--text-muted` | `text-[var(--text-muted)]` | Legendas, rótulos e placeholders (`#64748B`) |
| **Marca (Indigo)** | `--color-brand` | `text-[var(--color-brand)]` / `bg-[var(--color-brand)]` | Header, botões principais de ação (`#4F46E5`) |
| **Analytics (Blue)** | `--color-analytics` | `text-[var(--color-analytics)]` / `bg-[var(--color-analytics)]` | Gráficos e dados do Lojista/Shopping (`#2563EB`) |
| **Sucesso / Metas** | `--color-success` | `text-[var(--color-success)]` | Vouchers liberados e badges de sucesso (`#059669`) |
| **Barra de Progresso** | `--color-success-bar` | `bg-[var(--color-success-bar)]` | Preenchimento da barra dos R$ 150 (`#10B981`) |
| **Alerta / K-Anonymity** | `--color-warning` | `text-[var(--color-warning)]` | Avisos de privacidade ($k < 3$) e pendências (`#D97706`) |
| **Erro / Bloqueio** | `--color-danger` | `text-[var(--color-danger)]` | Notas rejeitadas e erros de validação (`#DC2626`) |

---

## 3. Exemplos Prontos de Copiar e Colar

### Exemplo 1: Card de KPI (Dashboard do Lojista e do Shopping)

```tsx
import { TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function KpiCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Ticket Médio da Loja
          </span>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-analytics-soft)] flex items-center justify-center text-[var(--color-analytics)]">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
            R$ 142,50
          </span>
          <Badge tone="success">
            <TrendingUp className="w-3 h-3 mr-1" />
            +8.4%
          </Badge>
        </div>

        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          Média da sua categoria: <strong className="tabular-nums">R$ 128,00</strong>
        </p>
      </CardContent>
    </Card>
  )
}
```

---

### Exemplo 2: Barra de Progresso do Estacionamento (Tela 1 — Consumidor)

```tsx
import { Car, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

interface EstacionamentoProgressProps {
  valorAcumulado: number // Ex: 110.00
  meta: number // Ex: 150.00
}

export function EstacionamentoProgress({ valorAcumulado, meta = 150 }: EstacionamentoProgressProps) {
  const percentual = Math.min(Math.round((valorAcumulado / meta) * 100), 100)
  const liberado = percentual >= 100
  const restante = Math.max(meta - valorAcumulado, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Car className="w-5 h-5 text-[var(--color-brand)]" />
            Estacionamento Grátis
          </CardTitle>
          <span className="text-xs font-bold text-[var(--color-brand)] tabular-nums">
            {percentual}% Concluído
          </span>
        </div>
        <CardDescription>
          Acumule R$ {meta.toFixed(2).replace('.', ',')} em notas de hoje para liberar seu voucher de isenção.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Barra de Progresso */}
        <div className="w-full h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-hairline)]">
          <div
            className="h-full bg-[var(--color-success-bar)] transition-all duration-500 rounded-full"
            style={{ width: `${percentual}%` }}
          />
        </div>

        {/* Valores */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-secondary)]">
            Acumulado hoje: <strong className="text-[var(--text-primary)] tabular-nums">R$ {valorAcumulado.toFixed(2).replace('.', ',')}</strong>
          </span>
          {liberado ? (
            <span className="text-[var(--color-success)] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Voucher Liberado!
            </span>
          ) : (
            <span className="text-[var(--text-muted)]">
              Faltam <strong className="text-[var(--text-primary)] tabular-nums">R$ {restante.toFixed(2).replace('.', ',')}</strong>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### Exemplo 3: Formulário de Envio de NFC-e + Botão Simular Leitura

```tsx
import { useState } from 'react'
import { QrCode, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function FormularioNfce() {
  const [chave, setChave] = useState('')

  // Chaves de teste determinísticas para a apresentação da banca
  const preencherChaveValida = () => {
    setChave('35261100012345000199650010000000011234567890')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <QrCode className="w-5 h-5 text-[var(--color-brand)]" />
          Cadastrar Cupom Fiscal (NFC-e)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
            Chave de Acesso (44 dígitos numéricos)
          </label>
          <input
            type="text"
            maxLength={44}
            value={chave}
            onChange={(e) => setChave(e.target.value.replace(/\D/g, ''))}
            placeholder="Digite os 44 números da chave do cupom..."
            className="w-full px-3.5 py-2.5 text-sm font-['JetBrains_Mono',monospace] bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Cadastrar Nota
          </Button>

          {/* Botão de Demonstração para a Banca */}
          <Button variant="outline" type="button" onClick={preencherChaveValida}>
            <Sparkles className="w-4 h-4 mr-2 text-[var(--color-brand)]" />
            Simular Leitura QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### Exemplo 4: Card de K-Anonymity Bloqueado (Tela 2 — Lojista)

Quando uma categoria possui menos de 3 lojas ativas ($k < 3$), a regra **ReN05** exige que a média seja escondida para proteger segredos comerciais:

```tsx
import { Lock, ShieldAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function KAnonymityBlockedCard() {
  return (
    <Card className="relative overflow-hidden border-dashed border-[var(--color-warning)]/50 bg-[var(--color-warning-soft)]/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-warning)]">
            Média da Categoria (Benchmarking)
          </span>
          <Badge tone="warning">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Privacidade LGPD
          </Badge>
        </div>

        <div className="mt-4 flex items-center gap-3 text-[var(--text-muted)]">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[var(--color-warning)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Benchmarking Temporariamente Indisponível
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Para proteger o sigilo concorrencial, as médias setoriais só são exibidas quando houver 3 ou mais lojistas ativos no seu segmento (ReN05).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### Exemplo 5: Cores Oficiais para Gráficos (Recharts)

Quando for criar gráficos com `recharts` (BarChart, PieChart, AreaChart), use exatamente estas cores hexadecimais correspondentes aos nossos tokens:

```tsx
export const CHART_PALETTE = {
  primary: '#2563EB',    // Blue 600 (Analytics)
  brand: '#4F46E5',      // Indigo 600 (Marca)
  success: '#10B981',    // Emerald 500
  accent: '#F59E0B',     // Amber 500
  secondary: '#64748B',  // Slate 500
  hairline: '#E2E8F0',   // Grade / Linhas do gráfico
}
```

Exemplo rápido de uso no Recharts:
```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function HorariosPicoChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="hora" stroke="#64748B" fontSize={12} />
          <YAxis stroke="#64748B" fontSize={12} className="tabular-nums" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px' }} 
          />
          <Bar dataKey="volume" fill="#2563EB" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

## 4. Referência dos Mockups por Integrante

Cada integrante do front tem um mockup visual oficial para guiar o layout e o espaçamento:

| Integrante | Card | Tela | Arquivo do Mockup |
| :--- | :--- | :--- | :--- |
| **Breno Brito** | `ORD-07` | Tela 1: Portal do Consumidor | [figura1-consumidor-desktop.png](../images/figura1-consumidor-desktop.png) e [figura2-consumidor-mobile.png](../images/figura2-consumidor-mobile.png) |
| **Walisson Kupertino** | `ORD-11` | Tela 2: Portal do Lojista | [figura3-portal-lojista.png](../images/figura3-portal-lojista.png) |
| **Victor Augusto** | `ORD-12` | Tela 3: Portal do Shopping | [figura4-portal-shopping.png](../images/figura4-portal-shopping.png) |

---

## 5. Prompt Pronto para o Breno colar no Qwen (Front com IA)

Para que o Qwen gere o código da **Tela 1 (`ORD-07`)** sem quebrar o padrão visual da equipe, use este prompt:

```text
Você vai construir o componente da Tela 1 (Portal do Consumidor - card ORD-07) em React + TypeScript + Tailwind CSS para o projeto Shopping Analytics & Loyalty Hub.

Siga estritamente as regras do Design System do projeto:
1. Use as primitivas já criadas: Button, Card, CardHeader, CardTitle, CardContent, CardDescription, Badge (importados de '@/components/ui/...').
2. Não invente cores hexadecimais soltas no JSX. Use os tokens semânticos do tokens.css:
   - Fundo: bg-[var(--bg-canvas)]
   - Cartões: bg-[var(--bg-surface)]
   - Marca: var(--color-brand)
   - Barra de progresso dos R$ 150: var(--color-success-bar)
3. Não use emojis como ícones — use ícones SVG da biblioteca 'lucide-react' (ex: QrCode, Car, Sparkles, Send, CheckCircle2).
4. Aplique a classe 'tabular-nums' em todos os valores monetários e números.
5. Inclua um botão "Simular Leitura QR Code" ao lado do envio para preencher chaves de teste determinísticas durante a apresentação da banca.

Baseie-se no mockup em .docs/images/figura1-consumidor-desktop.png e forneça código limpo, componentizado e tipado com TypeScript.
```
