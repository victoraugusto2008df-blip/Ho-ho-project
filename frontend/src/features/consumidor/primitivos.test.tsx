import { createElement } from 'react'
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { apiFalsa, beneficio, nota, renderPortal } from './testUtils'

/** Cada primitivo é envolvido para marcar o elemento que ele renderiza. */
vi.mock('@/components/ui/Button', async (original) => {
  const m = await original<typeof import('@/components/ui/Button')>()
  return { ...m, Button: (p: Parameters<typeof m.Button>[0]) => createElement(m.Button, { ...p, 'data-primitivo': 'Button' } as typeof p) }
})
vi.mock('@/components/ui/Badge', async (original) => {
  const m = await original<typeof import('@/components/ui/Badge')>()
  return { ...m, Badge: (p: Parameters<typeof m.Badge>[0]) => createElement(m.Badge, { ...p, 'data-primitivo': 'Badge' } as typeof p) }
})
vi.mock('@/components/ui/Card', async (original) => {
  const m = await original<typeof import('@/components/ui/Card')>()
  return { ...m, Card: (p: Parameters<typeof m.Card>[0]) => createElement(m.Card, { ...p, 'data-primitivo': 'Card' } as typeof p) }
})

describe('primitivos do design system', () => {
  it('C5 controles pílulas e blocos usam Button Badge e Card', async () => {
    const api = apiFalsa({
      beneficioHoje: vi
        .fn<() => Promise<ReturnType<typeof beneficio>>>()
        .mockResolvedValue(
          beneficio({
            percentual: 100,
            voucher: {
              codigo: 'EST-1111-2222',
              status: 'LIBERADO',
              emitidoEm: new Date().toISOString(),
              validoAte: new Date().toISOString(),
              qrPayload: 'EST-1111-2222',
            },
          }),
        ),
      listarNotasHoje: vi.fn<() => Promise<ReturnType<typeof nota>[]>>().mockRejectedValueOnce(new Error('x')).mockResolvedValue([nota()]),
      // "Reiniciar demonstração" só aparece com uma implementação que sabe reiniciar (o mock).
      reiniciar: vi.fn(),
    })
    const { user } = renderPortal(api)
    await screen.findByText('Voucher de estacionamento grátis')

    // "Tentar novamente" aparece com a lista em erro.
    const tentar = await screen.findByRole('button', { name: 'Tentar novamente' })
    expect(tentar.getAttribute('data-primitivo')).toBe('Button')

    for (const nome of [
      'Enviar nota',
      'Simular leitura de QR Code',
      /^Nota duplicada/,
      /^Nota com mais de 72h/,
      /^CNPJ fora do shopping/,
      'Reiniciar demonstração',
    ]) {
      expect(screen.getByRole('button', { name: nome }).getAttribute('data-primitivo'), String(nome)).toBe('Button')
    }

    await user.click(tentar)
    const pilulas = ['Validada', 'Pendente · pronto para uso', 'ReN01', 'ReN02', 'RF03']
    for (const texto of pilulas) {
      const el = await screen.findByText(texto)
      expect(el.closest('[data-primitivo="Badge"]'), texto).not.toBeNull()
    }

    for (const titulo of [
      'Seu progresso hoje',
      'Voucher de estacionamento grátis',
      'Cadastrar nota fiscal (NFC-e)',
      'Notas de hoje',
      'Painel do protótipo',
      'Ordem de validação (mock do backend)',
    ]) {
      expect(screen.getByText(titulo).closest('[data-primitivo="Card"]'), titulo).not.toBeNull()
    }
  })
})
