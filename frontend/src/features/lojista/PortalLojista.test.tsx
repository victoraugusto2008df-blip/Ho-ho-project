import { createElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { CHART_PALETTE, COR_PICO } from './chartPalette'
import { adiada, apiFalsa, campanha, dashboard, fixarTamanhoDosGraficos, renderPortal } from './testUtils'
import { formatarGap, gapDoTicket } from './regras'

// Espiões nos primitivos do design system (C28): cada um registra o que recebeu e renderiza o original.
const usados = vi.hoisted(() => ({ button: [] as unknown[], badge: [] as unknown[] }))
vi.mock('@/components/ui/Button', async (original) => {
  const modulo = await original<typeof import('@/components/ui/Button')>()
  return {
    ...modulo,
    Button: (props: Parameters<typeof modulo.Button>[0]) => {
      usados.button.push(props.children)
      return createElement(modulo.Button, props)
    },
  }
})
vi.mock('@/components/ui/Badge', async (original) => {
  const modulo = await original<typeof import('@/components/ui/Badge')>()
  return {
    ...modulo,
    Badge: (props: Parameters<typeof modulo.Badge>[0]) => {
      usados.badge.push(props.children)
      return createElement(modulo.Badge, props)
    },
  }
})
vi.mock('@/components/ui/Card', async (original) => {
  const modulo = await original<typeof import('@/components/ui/Card')>()
  return {
    ...modulo,
    Card: (props: Parameters<typeof modulo.Card>[0]) => createElement(modulo.Card, { ...props, 'data-ui': 'card' } as typeof props),
  }
})

const normalizar = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()

/** Elemento cujo texto completo, ignorando quebras e espaços repetidos, é `texto`. */
const textoCompleto = (texto: string) => (_: string, el: Element | null) =>
  !!el && normalizar(el.textContent) === texto && Array.from(el.children).every((c) => normalizar(c.textContent) !== texto)

const cardDe = (titulo: string) => screen.getByRole('heading', { name: titulo }).closest('[aria-labelledby]') as HTMLElement
const TITULOS_DOS_DADOS = ['Ticket médio', 'Benchmarking setorial', 'Horários de pico', 'Afinidade de compras cruzadas']
const BOTAO_DISPARAR = 'Disparar Cupom 15% OFF'

function textosDe(no: unknown): string[] {
  if (typeof no === 'string') return [no]
  if (Array.isArray(no)) return no.flatMap(textosDe)
  return []
}

beforeEach(() => {
  fixarTamanhoDosGraficos()
  usados.button.length = 0
  usados.badge.length = 0
})

afterEach(() => {
  window.history.pushState({}, '', '/')
})

describe('Montagem', () => {
  it('C2 App escolhe a Tela 2 só com tela=lojista', async () => {
    const casos: [string, boolean][] = [
      ['/', false],
      ['/?tela=lojista', true],
      ['/?tela=shopping', false],
    ]
    for (const [url, lojista] of casos) {
      window.history.pushState({}, '', url)
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
      const { unmount } = render(createElement(QueryClientProvider, { client: queryClient }, createElement(App)))
      if (lojista) {
        expect(screen.getByRole('heading', { name: 'Portal do Lojista' }), url).toBeTruthy()
        expect(screen.queryByText('Cadastrar nota fiscal (NFC-e)'), url).toBeNull()
      } else {
        expect(screen.getByText('Cadastrar nota fiscal (NFC-e)'), url).toBeTruthy()
        expect(screen.queryByRole('heading', { name: 'Portal do Lojista' }), url).toBeNull()
      }
      unmount()
    }
  })

  it('C23 cabeçalho mostra título e selos', async () => {
    renderPortal(apiFalsa())
    expect(screen.getByRole('heading', { level: 1, name: 'Portal do Lojista' })).toBeTruthy()
    expect(screen.getByText('Somente dados agregados da sua loja')).toBeTruthy()
    expect(screen.getByText('Protótipo · dados fictícios')).toBeTruthy()
    await screen.findAllByText('R$ 142,30')
  })
})

describe('S1 - benchmarking com a trava ReN05', () => {
  it('C3 card de ticket médio mostra o valor em reais', async () => {
    const casos: [number, string][] = [
      [142.3, 'R$ 142,30'],
      [1234.5, 'R$ 1.234,50'],
      [0, 'R$ 0,00'],
    ]
    for (const [ticket, texto] of casos) {
      const api = apiFalsa({ dashboard: vi.fn(async () => dashboard({ ticketMedio: ticket, benchmarkingDisponivel: false, mediaCategoria: null })) })
      const { unmount } = renderPortal(api)
      await waitFor(() => expect(within(cardDe('Ticket médio')).getByText(texto)).toBeTruthy())
      unmount()
    }
  })

  it('C4 benchmarking liberado mostra as duas barras e o gap com sinal', async () => {
    expect(gapDoTicket(142.3, 210)).toBe(-32.2)
    expect(gapDoTicket(227.52, 210)).toBe(8.3)
    expect(gapDoTicket(210, 210)).toBe(0)
    expect(gapDoTicket(100, 0)).toBeNull()
    expect(formatarGap(-32.2)).toBe('-32,2%')

    const casos: [number, string][] = [
      [142.3, '-32,2%'],
      [227.52, '+8,3%'],
      [210, '0,0%'],
    ]
    for (const [ticket, gap] of casos) {
      const api = apiFalsa({ dashboard: vi.fn(async () => dashboard({ ticketMedio: ticket, mediaCategoria: 210 })) })
      const { unmount } = renderPortal(api)
      const card = await waitFor(() => {
        const c = cardDe('Benchmarking setorial')
        within(c).getByText('Sua loja')
        return c
      })
      const linha = (rotulo: string) => within(card).getByText(rotulo).parentElement as HTMLElement
      expect(linha('Sua loja').textContent).toContain(ticket === 142.3 ? 'R$ 142,30' : ticket === 227.52 ? 'R$ 227,52' : 'R$ 210,00')
      expect(linha('Média da categoria').textContent).toContain('R$ 210,00')
      expect(within(card).getByText('Gap do ticket médio')).toBeTruthy()
      expect(within(card).getByText(gap)).toBeTruthy()
      unmount()
    }
  })

  it('C5 benchmarking bloqueado mostra cadeado e explicação da ReN05', async () => {
    const api = apiFalsa({ dashboard: vi.fn(async () => dashboard({ benchmarkingDisponivel: false, mediaCategoria: null })) })
    renderPortal(api)
    const card = await waitFor(() => {
      const c = cardDe('Benchmarking setorial')
      within(c).getByText('Benchmarking Temporariamente Indisponível')
      return c
    })
    expect(
      within(card).getByText(
        'Para proteger o sigilo concorrencial, as médias setoriais só são exibidas quando houver 3 ou mais lojistas ativos no seu segmento (ReN05).',
      ),
    ).toBeTruthy()
    // Ícone Lock do lucide-react, dentro de um contêiner tracejado no tom de alerta.
    const icone = card.querySelector('svg.lucide-lock')
    expect(icone).not.toBeNull()
    const tracejado = icone!.closest('.border-dashed') as HTMLElement
    expect(tracejado).not.toBeNull()
    expect(tracejado.className).toContain('border-[var(--color-warning)]')
    expect(within(card).getByText('Sua loja').parentElement!.textContent).toContain('R$ 142,30')
    expect(within(card).queryByText('Média da categoria')).toBeNull()
    expect(within(card).queryByText('Gap do ticket médio')).toBeNull()
  })

  it('C6 média da categoria nunca aparece com o benchmarking bloqueado', async () => {
    const enganado = apiFalsa({ dashboard: vi.fn(async () => dashboard({ benchmarkingDisponivel: false, mediaCategoria: 210 })) })
    const primeira = renderPortal(enganado)
    await screen.findByText('Benchmarking Temporariamente Indisponível')
    expect(document.body.textContent).not.toContain('210')
    primeira.unmount()

    const semMedia = apiFalsa({ dashboard: vi.fn(async () => dashboard({ benchmarkingDisponivel: true, mediaCategoria: null })) })
    renderPortal(semMedia)
    await screen.findByText('Benchmarking Temporariamente Indisponível')
    expect(screen.getByText('Para proteger o sigilo concorrencial', { exact: false })).toBeTruthy()
  })

  it('C7 aviso de K-Anonymity aparece com o benchmarking liberado', async () => {
    renderPortal(apiFalsa())
    const aviso =
      'Privacidade (K-Anonymity, ReN05): segmento com o mínimo exigido de 3 lojistas ativos. Os valores individuais de concorrentes nunca são exibidos, apenas a média do grupo.'
    expect(await screen.findByText(textoCompleto(aviso))).toBeTruthy()
  })
})

describe('S2 - horários de pico e compras cruzadas', () => {
  const horas10a21 = [28, 51, 103, 123, 98, 97, 110, 128, 165, 175, 139, 67].map((total, i) => ({ hora: 10 + i, total }))

  it('C8 gráfico de pico desenha uma barra por hora', async () => {
    renderPortal(apiFalsa({ dashboard: vi.fn(async () => dashboard({ horariosPico: horas10a21 })) }))
    const grafico = await screen.findByTestId('grafico-pico')
    await waitFor(() => expect(grafico.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(12))
  })

  it('C9 barra de pico destacada e legenda do pico na tela', async () => {
    renderPortal(apiFalsa({ dashboard: vi.fn(async () => dashboard({ horariosPico: horas10a21 })) }))
    const grafico = await screen.findByTestId('grafico-pico')
    await waitFor(() => expect(grafico.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(12))
    const preenchimentos = Array.from(grafico.querySelectorAll('.recharts-bar-rectangle path')).map((p) => p.getAttribute('fill'))
    expect(preenchimentos).toHaveLength(12)
    expect(preenchimentos[9]).toBe(COR_PICO)
    expect(preenchimentos.filter((_, i) => i !== 9).every((cor) => cor === CHART_PALETTE.primary)).toBe(true)
    expect(COR_PICO).not.toBe(CHART_PALETTE.primary)
    // O valor do pico aparece acima da barra, uma vez só.
    const valores = Array.from(grafico.querySelectorAll('svg text')).filter((t) => t.textContent === '175')
    expect(valores.some((t) => t.classList.contains('tabular-nums'))).toBe(true)
    expect(screen.getByText('Pico às 19h–20h com 175 vendas (13,6% do total de 1.284).')).toBeTruthy()
  })

  it('C10 ver dados em tabela abre a tabela de horários e vendas', async () => {
    const { user } = renderPortal(apiFalsa({ dashboard: vi.fn(async () => dashboard({ horariosPico: horas10a21 })) }))
    expect(screen.queryByRole('table')).toBeNull()
    await user.click(await screen.findByRole('button', { name: 'Ver dados em tabela' }))
    const tabela = screen.getByRole('table')
    expect(within(tabela).getByRole('columnheader', { name: 'Horário' })).toBeTruthy()
    expect(within(tabela).getByRole('columnheader', { name: 'Vendas' })).toBeTruthy()
    const linhas = within(tabela).getAllByRole('row').slice(1)
    expect(linhas).toHaveLength(12)
    expect(linhas[0].textContent).toBe('10h28')
    expect(linhas[9].textContent).toBe('19h175')
  })

  it('C11 afinidade lista as 6 maiores categorias com contagem de compras', async () => {
    const oito = [
      ['Alimentação', 100],
      ['Vestuário', 80],
      ['Zeta', 50],
      ['Beta', 50],
      ['Esportes', 40],
      ['Lazer', 30],
      ['Pets', 20],
      ['Livros', 10],
    ].map(([categoria, total]) => ({ categoria: categoria as string, total: total as number }))
    const primeira = renderPortal(apiFalsa({ dashboard: vi.fn(async () => dashboard({ crossShopping: oito })) }))
    const card = await waitFor(() => {
      const c = cardDe('Afinidade de compras cruzadas')
      within(c).getByText('Alimentação')
      return c
    })
    const itens = within(card).getAllByRole('listitem')
    expect(itens.map((li) => li.textContent)).toEqual([
      'Alimentação100 compras',
      'Vestuário80 compras',
      'Beta50 compras',
      'Zeta50 compras',
      'Esportes40 compras',
      'Lazer30 compras',
    ])
    const larguras = within(card).getAllByTestId('barra-afinidade').map((b) => (b as HTMLElement).style.width)
    expect(larguras[0]).toBe('100%')
    expect(larguras[2]).toBe('50%')
    expect(within(card).getByText('Compras dos seus clientes em outras categorias')).toBeTruthy()
    expect(within(card).getByText('Mostramos apenas categorias, nunca lojas específicas ou clientes individuais.')).toBeTruthy()
    primeira.unmount()

    renderPortal(apiFalsa({ dashboard: vi.fn(async () => dashboard({ crossShopping: [{ categoria: 'Pets', total: 1 }] })) }))
    expect(await screen.findByText('1 compra')).toBeTruthy()
  })

  it('C12 pico e afinidade vazios mostram o estado vazio', async () => {
    renderPortal(apiFalsa({ dashboard: vi.fn(async () => dashboard({ horariosPico: [], crossShopping: [] })) }))
    expect(await screen.findByText('Ainda não há vendas identificadas para calcular os horários de pico.')).toBeTruthy()
    expect(screen.getByText('Ainda não há compras cruzadas dos seus clientes em outras categorias.')).toBeTruthy()
    expect(screen.queryByTestId('grafico-pico')).toBeNull()
  })
})

describe('S3 - campanha em 1 clique', () => {
  it('C13 card de campanha mostra segmento desconto e botão fixos', async () => {
    renderPortal(apiFalsa())
    const card = cardDe('Nova campanha em 1 clique')
    expect(within(card).getByText('Cupom enviado pelo app do shopping a um segmento pré-qualificado.')).toBeTruthy()
    expect(within(card).getByText('Sem acesso a CPFs ou contatos')).toBeTruthy()
    expect(within(card).getByText('Clientes da sua loja inativos há 60 dias')).toBeTruthy()
    expect(within(card).getByText('15%')).toBeTruthy()
    expect(within(card).getByRole('button', { name: BOTAO_DISPARAR })).toBeTruthy()
    await screen.findAllByText('R$ 142,30')
  })

  it('C14 disparar campanha envia o corpo fixo e mostra o público atingido', async () => {
    const casos: [number, string][] = [
      [312, 'Campanha disparada! Cupom de 15% OFF enviado a 312 clientes.'],
      [1, 'Campanha disparada! Cupom de 15% OFF enviado a 1 cliente.'],
      [0, 'Campanha registrada, mas nenhum cliente está no segmento agora.'],
    ]
    for (const [publico, mensagem] of casos) {
      const api = apiFalsa({ dispararCampanha: vi.fn(async () => campanha({ publicoAtingido: publico })) })
      const { user, unmount } = renderPortal(api)
      await user.click(screen.getByRole('button', { name: BOTAO_DISPARAR }))
      expect(await screen.findByText(mensagem)).toBeTruthy()
      expect(api.dispararCampanha).toHaveBeenCalledTimes(1)
      expect(api.dispararCampanha).toHaveBeenCalledWith({
        titulo: 'Cupom 15% OFF',
        descontoPercentual: 15,
        criterioAlvo: 'INATIVOS_60_DIAS',
      })
      unmount()
    }
  })

  it('C15 botão de campanha fica desabilitado durante o disparo', async () => {
    const pendente = adiada<ReturnType<typeof campanha>>()
    const api = apiFalsa({ dispararCampanha: vi.fn(() => pendente.promessa) })
    const { user } = renderPortal(api)
    await user.click(screen.getByRole('button', { name: BOTAO_DISPARAR }))
    const botao = await screen.findByRole('button', { name: 'Disparando…' })
    expect((botao as HTMLButtonElement).disabled).toBe(true)
    await user.click(botao)
    expect(api.dispararCampanha).toHaveBeenCalledTimes(1)

    pendente.resolver(campanha())
    const pronto = await screen.findByRole('button', { name: BOTAO_DISPARAR })
    expect((pronto as HTMLButtonElement).disabled).toBe(false)
  })

  it('C16 falha no disparo mostra o erro e reabilita o botão', async () => {
    const api = apiFalsa({ dispararCampanha: vi.fn(async () => Promise.reject(new Error('falhou'))) })
    const { user } = renderPortal(api)
    await user.click(screen.getByRole('button', { name: BOTAO_DISPARAR }))
    expect(await screen.findByText('Não foi possível disparar a campanha. Tente novamente.')).toBeTruthy()
    const botao = screen.getByRole('button', { name: BOTAO_DISPARAR }) as HTMLButtonElement
    expect(botao.disabled).toBe(false)
    await user.click(botao)
    await waitFor(() => expect(api.dispararCampanha).toHaveBeenCalledTimes(2))
  })
})

describe('S4 - só a loja do token, com estados de carga e erro', () => {
  it('C20 nenhum seletor de loja e nenhum lojaId nas requisições', async () => {
    const { container } = renderPortal(apiFalsa())
    await screen.findAllByText('R$ 142,30')
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(container.querySelector('select')).toBeNull()

    const { criarRealLojistaApi } = await import('./realLojistaApi')
    const fetcher = vi.fn(async () => dashboard())
    const real = criarRealLojistaApi(fetcher as never)
    await real.dashboard()
    await real.dispararCampanha({ titulo: 'Cupom 15% OFF', descontoPercentual: 15, criterioAlvo: 'INATIVOS_60_DIAS' })
    const requisicoes = JSON.stringify(fetcher.mock.calls)
    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(requisicoes).not.toMatch(/lojaId|loja_id/)
  })

  it('C21 os quatro cards de dados mostram carregando', () => {
    renderPortal(apiFalsa({ dashboard: vi.fn(() => new Promise<never>(() => {})) }))
    for (const titulo of TITULOS_DOS_DADOS) {
      expect(within(cardDe(titulo)).getByRole('status', { name: 'Carregando…' }), titulo).toBeTruthy()
    }
    expect(screen.queryByText(/R\$/)).toBeNull()
  })

  it('C22 erro do dashboard mostra tentar novamente e mantém a campanha', async () => {
    const api = apiFalsa({
      dashboard: vi
        .fn<() => Promise<ReturnType<typeof dashboard>>>()
        .mockRejectedValueOnce(new Error('falhou'))
        .mockResolvedValue(dashboard()),
    })
    const { user } = renderPortal(api)
    await waitFor(() => expect(screen.getAllByText('Não foi possível carregar os dados da sua loja.')).toHaveLength(4))
    for (const titulo of TITULOS_DOS_DADOS) {
      expect(within(cardDe(titulo)).getByRole('button', { name: 'Tentar novamente' }), titulo).toBeTruthy()
    }
    expect((screen.getByRole('button', { name: BOTAO_DISPARAR }) as HTMLButtonElement).disabled).toBe(false)

    await user.click(screen.getAllByRole('button', { name: 'Tentar novamente' })[0])
    expect(api.dashboard).toHaveBeenCalledTimes(2)
    await waitFor(() => expect(within(cardDe('Ticket médio')).getByText('R$ 142,30')).toBeTruthy())
  })
})

describe('Design system', () => {
  it('C27 valores percentuais e contagens da Tela 2 usam tabular-nums', async () => {
    const horas = [28, 51, 103, 123, 98, 97, 110, 128, 165, 175, 139, 67].map((total, i) => ({ hora: 10 + i, total }))
    const { container } = renderPortal(
      apiFalsa({
        dashboard: vi.fn(async () =>
          dashboard({
            horariosPico: horas,
            crossShopping: [
              { categoria: 'Alimentação', total: 796 },
              { categoria: 'Pets', total: 1 },
            ],
          }),
        ),
      }),
    )
    await screen.findByText('Privacidade (K-Anonymity, ReN05):', { exact: false })
    await screen.findByText('796 compras')
    const valor = /R\$|\d\s?%|\d+ (compras?|vendas?)/
    const suspeitos = Array.from(container.querySelectorAll('*')).filter((el) =>
      Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && valor.test(n.textContent ?? '')),
    )
    expect(suspeitos.length).toBeGreaterThan(8)
    for (const el of suspeitos) {
      expect(el.closest('.tabular-nums'), `sem tabular-nums: ${normalizar(el.textContent)}`).not.toBeNull()
    }
  })

  it('C28 controles selos e blocos da Tela 2 usam Button Badge e Card', async () => {
    const api = apiFalsa({
      dashboard: vi.fn<() => Promise<ReturnType<typeof dashboard>>>().mockRejectedValueOnce(new Error('falhou')).mockResolvedValue(dashboard()),
    })
    const { user } = renderPortal(api)
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Tentar novamente' })).toHaveLength(4))
    await user.click(screen.getAllByRole('button', { name: 'Tentar novamente' })[0])
    await screen.findAllByText('R$ 142,30')

    const botoes = usados.button.flatMap(textosDe)
    expect(botoes).toContain(BOTAO_DISPARAR)
    expect(botoes).toContain('Tentar novamente')
    const selos = usados.badge.flatMap(textosDe)
    for (const selo of ['Somente dados agregados da sua loja', 'Protótipo · dados fictícios', 'Sem acesso a CPFs ou contatos']) {
      expect(selos).toContain(selo)
    }
    for (const titulo of [...TITULOS_DOS_DADOS, 'Nova campanha em 1 clique']) {
      expect(screen.getByRole('heading', { name: titulo }).closest('[data-ui="card"]'), titulo).not.toBeNull()
    }
  })
})
