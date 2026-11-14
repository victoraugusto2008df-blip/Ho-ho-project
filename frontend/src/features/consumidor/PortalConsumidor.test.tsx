import { createElement } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { CHAVES_DEMO, mockNotasApi } from './mockNotasApi'
import { criarRealNotasApi } from './realNotasApi'
import type { Fetcher } from './notasApi'
import { cpfValido } from './regras'
import { adiada, apiFalsa, beneficio, nota, renderPortal } from './testUtils'
import type { NotaHoje } from './types'

const qr = vi.hoisted(() => ({ valores: [] as string[] }))
vi.mock('qrcode.react', async (original) => {
  const modulo = await original<typeof import('qrcode.react')>()
  return {
    ...modulo,
    QRCodeSVG: (props: Parameters<typeof modulo.QRCodeSVG>[0]) => {
      qr.valores.push(props.value as string)
      return createElement(modulo.QRCodeSVG, props)
    },
  }
})

const normalizar = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()

/** Encontra o elemento mais interno cujo texto completo é `texto`. */
const textoCompleto = (texto: string) => (_: string, el: Element | null) =>
  !!el && normalizar(el.textContent) === texto && Array.from(el.children).every((c) => normalizar(c.textContent) !== texto)

const campoChave = () => screen.getByLabelText('Chave de acesso (44 dígitos)') as HTMLTextAreaElement
const campoCpf = () => screen.getByLabelText('CPF') as HTMLInputElement
const consentimento = () => screen.getByRole('checkbox', { name: /Autorizo o uso dos dados/ })
const botaoEnviar = () => screen.getByRole('button', { name: /^(Enviar nota|Enviando…)$/ })
const digitos = (valor: string) => valor.replace(/\D/g, '')
const cardDe = (titulo: string) => screen.getByText(titulo).closest('[aria-labelledby]') as HTMLElement

function hojeAs(hora: number, minuto: number): string {
  const d = new Date()
  d.setHours(hora, minuto, 0, 0)
  return d.toISOString()
}

const VOUCHER = {
  codigo: 'EST-6884-7100',
  status: 'LIBERADO' as const,
  emitidoEm: hojeAs(14, 19),
  validoAte: hojeAs(22, 0),
  qrPayload: 'QR-PAYLOAD-EST-6884-7100',
}

describe('S1 - a tela dos mockups', () => {
  it('C4 todo valor em reais, percentual e contador usa tabular-nums', async () => {
    const api = apiFalsa({
      beneficioHoje: vi.fn(async () =>
        beneficio({ valorAcumulado: 208.33, percentual: 100, faltante: 0, voucher: VOUCHER }),
      ),
      listarNotasHoje: vi.fn(async () => [
        nota({ chave: '1'.repeat(44), valor: 59.86, dataEmissao: hojeAs(12, 59) }),
        nota({ chave: '2'.repeat(44), valor: 148.47, dataEmissao: hojeAs(13, 44) }),
      ]),
    })
    const { container } = renderPortal(api)
    await screen.findByText('Voucher de estacionamento grátis')
    await screen.findByText('2 notas · R$ 208,33')

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
    const numericos: string[] = []
    for (let no = walker.nextNode(); no; no = walker.nextNode()) {
      const texto = no.textContent ?? ''
      if (!/R\$\s?\d|\d+\s?%|\d+\/44/.test(texto)) continue
      numericos.push(texto)
      expect(no.parentElement?.closest('.tabular-nums'), `sem tabular-nums: "${texto}"`).not.toBeNull()
    }
    expect(numericos.length).toBeGreaterThanOrEqual(8)
  })
})

describe('S2 - progresso e voucher', () => {
  it('C7 progresso mostra acumulado CPF e barra limitada a 0-100', async () => {
    const casos: Array<[number, number, string]> = [
      [0, 0, '0%'],
      [72, 48, '48%'],
      [208.33, 139, '100%'],
      [10, -5, '0%'],
    ]
    for (const [valorAcumulado, percentual, largura] of casos) {
      const api = apiFalsa({ beneficioHoje: vi.fn(async () => beneficio({ valorAcumulado, percentual })) })
      const { unmount } = renderPortal(api)
      const barra = await screen.findByTestId('barra-progresso')
      expect(barra.style.width).toBe(largura)
      unmount()
    }

    const api = apiFalsa({ beneficioHoje: vi.fn(async () => beneficio({ valorAcumulado: 208.33, percentual: 100 })) })
    renderPortal(api)
    const card = cardDe('Seu progresso hoje')
    expect(await within(card).findByText('R$ 208,33')).toBeTruthy()
    expect(within(card).getByText('de R$ 150,00')).toBeTruthy()
    expect(within(card).getByText('CPF ***.982.247-**')).toBeTruthy()
  })

  it('C8 mostra o faltante abaixo da meta e meta atingida em 100', async () => {
    const abaixo: Array<[number, number, string]> = [
      [150, 0, 'Faltam R$ 150,00 para liberar seu estacionamento.'],
      [0.01, 99, 'Faltam R$ 0,01 para liberar seu estacionamento.'],
    ]
    for (const [faltante, percentual, texto] of abaixo) {
      const { unmount } = renderPortal(apiFalsa({ beneficioHoje: vi.fn(async () => beneficio({ faltante, percentual })) }))
      expect(await screen.findByText(textoCompleto(texto))).toBeTruthy()
      expect(screen.queryByText(/Meta atingida!/)).toBeNull()
      unmount()
    }

    renderPortal(
      apiFalsa({ beneficioHoje: vi.fn(async () => beneficio({ valorAcumulado: 150, faltante: 0, percentual: 100 })) }),
    )
    const meta = await screen.findByText(textoCompleto('Meta atingida! Seu estacionamento de hoje está liberado.'))
    expect(meta.querySelector('svg.lucide-check')).not.toBeNull()
    expect(screen.queryByText(/Faltam/)).toBeNull()
  })

  it('C9 voucher liberado mostra QR do qrPayload código horários e regras', async () => {
    qr.valores.length = 0
    renderPortal(apiFalsa({ beneficioHoje: vi.fn(async () => beneficio({ percentual: 100, voucher: VOUCHER })) }))
    const card = cardDe(await screen.findByText('Voucher de estacionamento grátis').then((el) => el.textContent ?? ''))

    expect(within(card).getByText('Apresente o QR Code na cancela de saída.')).toBeTruthy()
    expect(within(card).getByText(textoCompleto('Pendente · pronto para uso'))).toBeTruthy()
    expect(qr.valores.at(-1)).toBe('QR-PAYLOAD-EST-6884-7100')
    expect(card.querySelector('svg')).not.toBeNull()

    const valorDe = (rotulo: string) => normalizar(within(card).getByText(rotulo).nextElementSibling?.textContent)
    expect(valorDe('Código')).toBe('EST-6884-7100')
    expect(valorDe('Emitido às')).toBe('14:19')
    expect(valorDe('Válido até')).toBe('Hoje, 22:00 (fechamento)')
    expect(
      within(card).getByText(textoCompleto('Economia de R$ 15,00 no estacionamento (valor público da diária)')),
    ).toBeTruthy()
    expect(
      within(card).getByText(
        textoCompleto(
          'Limite de 1 isenção por CPF por dia. Válido para saída até o fechamento do shopping hoje (seg. a sáb. 22h; dom. 20h).',
        ),
      ),
    ).toBeTruthy()
  })

  it('C11 sem voucher o card do voucher não aparece', async () => {
    renderPortal(apiFalsa({ beneficioHoje: vi.fn(async () => beneficio({ valorAcumulado: 60, percentual: 40 })) }))
    await within(cardDe('Seu progresso hoje')).findByText('R$ 60,00')
    expect(screen.queryByText('Voucher de estacionamento grátis')).toBeNull()
  })

  it('C12 progresso tem estado de carregando erro e tentar novamente', async () => {
    const pendente = adiada<ReturnType<typeof beneficio>>()
    const { unmount } = renderPortal(apiFalsa({ beneficioHoje: vi.fn(() => pendente.promessa) }))
    expect(screen.getByText('Carregando seu progresso…')).toBeTruthy()
    expect(cardDe('Seu progresso hoje').textContent).not.toMatch(/R\$/)
    unmount()

    const beneficioHoje = vi
      .fn<() => Promise<ReturnType<typeof beneficio>>>()
      .mockRejectedValueOnce(new Error('falhou'))
      .mockResolvedValue(beneficio({ valorAcumulado: 60, percentual: 40 }))
    const { user } = renderPortal(apiFalsa({ beneficioHoje }))
    expect(await screen.findByText('Não foi possível carregar seu progresso.')).toBeTruthy()
    await user.click(within(cardDe('Seu progresso hoje')).getByRole('button', { name: 'Tentar novamente' }))
    expect(await within(cardDe('Seu progresso hoje')).findByText('R$ 60,00')).toBeTruthy()
    expect(beneficioHoje).toHaveBeenCalledTimes(2)
  })
})

describe('S3 - cadastrar nota', () => {
  it('C13 campo da chave aceita só 44 dígitos em grupos de 4 com contador', async () => {
    const { user } = renderPortal(apiFalsa())
    const contador = screen.getByTestId('contador-chave')
    expect(contador.textContent).toBe('0/44')
    expect(screen.getByText('Fica impressa abaixo do QR Code do cupom fiscal.')).toBeTruthy()

    await user.click(campoChave())
    await user.paste(CHAVES_DEMO.VALIDA_60.replace(/(\d{4})(?=\d)/g, '$1 '))
    expect(digitos(campoChave().value)).toBe(CHAVES_DEMO.VALIDA_60)
    expect(contador.textContent).toBe('44/44')
    expect(campoChave().value).toBe(CHAVES_DEMO.VALIDA_60.match(/\d{4}/g)!.join(' '))

    await user.type(campoChave(), 'a')
    expect(digitos(campoChave().value)).toBe(CHAVES_DEMO.VALIDA_60)
    await user.type(campoChave(), '9')
    expect(digitos(campoChave().value)).toBe(CHAVES_DEMO.VALIDA_60)
    expect(contador.textContent).toBe('44/44')
  })

  it('C14 simular leitura percorre o ciclo de chaves válidas sem enviar', async () => {
    const api = apiFalsa()
    const { user } = renderPortal(api)
    const botao = screen.getByRole('button', { name: 'Simular leitura de QR Code' })
    for (const esperada of [CHAVES_DEMO.VALIDA_60, CHAVES_DEMO.VALIDA_90, CHAVES_DEMO.VALIDA_40, CHAVES_DEMO.VALIDA_60]) {
      await user.click(botao)
      expect(digitos(campoChave().value)).toBe(esperada)
    }
    expect(api.enviarNota).not.toHaveBeenCalled()
  })

  it('C15 CPF abre com o fictício e o link o preenche', async () => {
    const { user } = renderPortal(apiFalsa())
    expect(campoCpf().value).toBe('529.982.247-25')
    expect(screen.getByText(textoCompleto('CPF fictício de teste: 529.982.247-25'))).toBeTruthy()
    await user.clear(campoCpf())
    expect(campoCpf().value).toBe('')
    await user.click(screen.getByRole('button', { name: '529.982.247-25' }))
    expect(campoCpf().value).toBe('529.982.247-25')
  })

  it('C16 CPF com dígito verificador inválido é recusado sem requisição', async () => {
    expect(cpfValido('529.982.247-25')).toBe(true)
    expect(cpfValido('52998224725')).toBe(true)
    expect(cpfValido('529.982.247-24')).toBe(false)
    expect(cpfValido('111.111.111-11')).toBe(false)
    expect(cpfValido('5299822472')).toBe(false)

    const api = apiFalsa()
    const { user } = renderPortal(api)
    await user.clear(campoCpf())
    await user.type(campoCpf(), '52998224724')
    expect(campoCpf().value).toBe('529.982.247-24')
    await user.click(consentimento())
    await user.click(screen.getByRole('button', { name: 'Simular leitura de QR Code' }))
    await user.click(botaoEnviar())
    expect(screen.getByRole('alert').textContent).toBe('Informe um CPF válido.')
    expect(api.enviarNota).not.toHaveBeenCalled()
  })

  it('C17 sem autorização LGPD nada é enviado', async () => {
    const api = apiFalsa()
    const { user } = renderPortal(api)
    expect((consentimento() as HTMLInputElement).checked).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Simular leitura de QR Code' }))
    await user.click(botaoEnviar())
    expect(screen.getByRole('alert').textContent).toBe(
      'Marque a autorização de uso dos dados (LGPD) para enviar a nota.',
    )
    expect(api.enviarNota).not.toHaveBeenCalled()
  })

  it('C18 chave incompleta é recusada sem requisição', async () => {
    const api = apiFalsa()
    const { user } = renderPortal(api)
    await user.click(consentimento())
    await user.click(campoChave())
    await user.paste(CHAVES_DEMO.VALIDA_60.slice(0, 43))
    await user.click(botaoEnviar())
    expect(screen.getByRole('alert').textContent).toBe('A chave precisa ter 44 dígitos numéricos.')
    expect(api.enviarNota).not.toHaveBeenCalled()
  })

  it('C19 envio aprovado limpa a chave e atualiza lista e progresso', async () => {
    let aprovada = false
    const notaAprovada = nota({ chave: CHAVES_DEMO.VALIDA_60, valor: 60 })
    const envio = adiada<NotaHoje>()
    const api = apiFalsa({
      enviarNota: vi.fn(() => envio.promessa),
      listarNotasHoje: vi.fn(async () => (aprovada ? [notaAprovada] : [])),
      beneficioHoje: vi.fn(async () =>
        aprovada ? beneficio({ valorAcumulado: 60, percentual: 40, faltante: 90 }) : beneficio(),
      ),
    })
    const { user } = renderPortal(api)
    await screen.findByText('Nenhuma nota enviada hoje. Cadastre a primeira acima.')

    await user.click(consentimento())
    await user.click(screen.getByRole('button', { name: 'Simular leitura de QR Code' }))
    await user.click(botaoEnviar())
    expect(botaoEnviar().textContent).toBe('Enviando…')
    expect((botaoEnviar() as HTMLButtonElement).disabled).toBe(true)
    await user.click(botaoEnviar())
    expect(api.enviarNota).toHaveBeenCalledTimes(1)
    expect(api.enviarNota).toHaveBeenCalledWith(CHAVES_DEMO.VALIDA_60)

    aprovada = true
    envio.resolver(notaAprovada)
    expect((await screen.findByRole('status')).textContent).toBe('Nota de R$ 60,00 validada.')
    expect(campoChave().value).toBe('')
    expect(await within(cardDe('Notas de hoje')).findByText('Renner Shopping Hub')).toBeTruthy()
    expect(await within(cardDe('Seu progresso hoje')).findByText('R$ 60,00')).toBeTruthy()
  })

  describe('com o mock da demonstração', () => {
    beforeEach(() => mockNotasApi.reiniciar())

    it('C20 cada recusa de negócio mostra a regra e a mensagem própria', async () => {
      const { user } = renderPortal(mockNotasApi)
      await user.click(consentimento())
      await user.click(screen.getByRole('button', { name: 'Simular leitura de QR Code' }))
      await user.click(botaoEnviar())
      await screen.findByRole('status')
      await within(cardDe('Seu progresso hoje')).findByText('R$ 60,00')

      const casos: Array<[string, string, string]> = [
        [CHAVES_DEMO.DUPLICADA, 'ReN01', 'Esta nota já foi cadastrada. Cada nota vale apenas uma vez.'],
        [CHAVES_DEMO.ANTIGA, 'ReN02', 'Esta nota foi emitida há mais de 72 horas e não pode ser usada.'],
        [CHAVES_DEMO.LOJA_NAO_CREDENCIADA, 'RF03', 'A loja emissora não participa do programa do shopping.'],
      ]
      for (const [chave, regra, mensagem] of casos) {
        await user.clear(campoChave())
        await user.click(campoChave())
        await user.paste(chave)
        await user.click(botaoEnviar())
        const alerta = await screen.findByRole('alert')
        expect(within(alerta).getByText(regra)).toBeTruthy()
        expect(within(alerta).getByText(mensagem)).toBeTruthy()
        expect(digitos(campoChave().value)).toBe(chave)
        await waitFor(() => expect(within(cardDe('Notas de hoje')).getAllByRole('listitem')).toHaveLength(1))
        expect(within(cardDe('Seu progresso hoje')).getByText('R$ 60,00')).toBeTruthy()
      }
    })
  })

  it('C21 falha técnica mostra a mensagem genérica e mantém a chave', async () => {
    const rejeicoes: unknown[] = [
      new TypeError('Failed to fetch'),
      { status: 500, body: null },
      { status: 422, body: { codigo: 'OUTRO', mensagem: 'x' } },
    ]
    for (const rejeicao of rejeicoes) {
      const fetcher = (async (path: string, init?: RequestInit) => {
        if (init?.method === 'POST') throw rejeicao
        return path === '/notas/hoje' ? [] : beneficio()
      }) as Fetcher
      const { user, unmount } = renderPortal(criarRealNotasApi(fetcher))
      await user.click(consentimento())
      await user.click(screen.getByRole('button', { name: 'Simular leitura de QR Code' }))
      await user.click(botaoEnviar())
      expect((await screen.findByRole('alert')).textContent).toBe('Não foi possível enviar a nota. Tente novamente.')
      expect(digitos(campoChave().value)).toBe(CHAVES_DEMO.VALIDA_60)
      unmount()
    }
  })

  it('C22 editar a chave apaga a mensagem anterior', async () => {
    const { user } = renderPortal(apiFalsa())
    await user.click(consentimento())
    await user.click(campoChave())
    await user.paste('123')
    await user.click(botaoEnviar())
    expect(screen.getByRole('alert')).toBeTruthy()
    await user.type(campoChave(), '4')
    expect(screen.queryByRole('alert')).toBeNull()

    await user.clear(campoChave())
    await user.click(screen.getByRole('button', { name: 'Simular leitura de QR Code' }))
    await user.click(botaoEnviar())
    expect(await screen.findByRole('status')).toBeTruthy()
    await user.type(campoChave(), '1')
    expect(screen.queryByRole('status')).toBeNull()
  })
})

describe('S4 - notas de hoje', () => {
  it('C23 lista ordena da mais recente e soma no cabeçalho', async () => {
    const notas = [
      nota({ chave: '1'.repeat(44), estabelecimento: 'Renner Shopping Hub', valor: 60, dataEmissao: hojeAs(12, 59) }),
      nota({
        chave: '2'.repeat(44),
        estabelecimento: 'Fast Shop',
        categoria: 'Eletrônicos',
        valor: 90,
        dataEmissao: hojeAs(14, 15),
      }),
    ]
    const { unmount } = renderPortal(apiFalsa({ listarNotasHoje: vi.fn(async () => notas) }))
    const card = cardDe('Notas de hoje')
    expect(await within(card).findByText('2 notas · R$ 150,00')).toBeTruthy()
    const linhas = within(card).getAllByRole('listitem')
    const esperado = [
      ['Fast Shop', 'Eletrônicos · 14:15', 'R$ 90,00'],
      ['Renner Shopping Hub', 'Vestuário · 12:59', 'R$ 60,00'],
    ]
    expect(linhas).toHaveLength(2)
    esperado.forEach((campos, i) => {
      for (const campo of [...campos, 'Validada']) expect(within(linhas[i]).getByText(textoCompleto(campo))).toBeTruthy()
    })
    unmount()

    renderPortal(apiFalsa({ listarNotasHoje: vi.fn(async () => [notas[0]]) }))
    expect(await within(cardDe('Notas de hoje')).findByText('1 nota · R$ 60,00')).toBeTruthy()
  })

  it('C24 lista vazia mostra o estado vazio', async () => {
    renderPortal(apiFalsa())
    expect(await screen.findByText('Nenhuma nota enviada hoje. Cadastre a primeira acima.')).toBeTruthy()
  })

  it('C25 lista tem estado de carregando erro e tentar novamente', async () => {
    const pendente = adiada<NotaHoje[]>()
    const { unmount } = renderPortal(apiFalsa({ listarNotasHoje: vi.fn(() => pendente.promessa) }))
    expect(screen.getByText('Carregando suas notas…')).toBeTruthy()
    unmount()

    const listarNotasHoje = vi
      .fn<() => Promise<NotaHoje[]>>()
      .mockRejectedValueOnce(new Error('falhou'))
      .mockResolvedValue([nota({ estabelecimento: 'Fast Shop' })])
    const { user } = renderPortal(apiFalsa({ listarNotasHoje }))
    expect(await screen.findByText('Não foi possível carregar suas notas.')).toBeTruthy()
    await user.click(within(cardDe('Notas de hoje')).getByRole('button', { name: 'Tentar novamente' }))
    expect(await within(cardDe('Notas de hoje')).findByText('Fast Shop')).toBeTruthy()
    expect(listarNotasHoje).toHaveBeenCalledTimes(2)
  })
})

describe('S5 - painel do protótipo', () => {
  beforeEach(() => mockNotasApi.reiniciar())

  it('C26 botões do painel enviam a chave de cada erro', async () => {
    const enviarNota = vi.spyOn(mockNotasApi, 'enviarNota')
    try {
      const { user } = renderPortal(mockNotasApi)

      await user.click(screen.getByRole('button', { name: /^Nota duplicada/ }))
      expect(screen.getByRole('alert').textContent).toBe(
        'Marque a autorização de uso dos dados (LGPD) para enviar a nota.',
      )
      expect(enviarNota).not.toHaveBeenCalled()

      await user.click(consentimento())
      const casos: Array<[RegExp, string, string]> = [
        [/^Nota duplicada/, CHAVES_DEMO.DUPLICADA, 'Esta nota já foi cadastrada. Cada nota vale apenas uma vez.'],
        [/^Nota com mais de 72h/, CHAVES_DEMO.ANTIGA, 'Esta nota foi emitida há mais de 72 horas e não pode ser usada.'],
        [/^CNPJ fora do shopping/, CHAVES_DEMO.LOJA_NAO_CREDENCIADA, 'A loja emissora não participa do programa do shopping.'],
      ]
      for (const [nome, chave, mensagem] of casos) {
        await user.click(screen.getByRole('button', { name: nome }))
        expect(await screen.findByText(mensagem)).toBeTruthy()
        expect(enviarNota).toHaveBeenLastCalledWith(chave)
        expect(digitos(campoChave().value)).toBe(chave)
      }
    } finally {
      enviarNota.mockRestore()
    }
  })

  it('C27 reiniciar zera a demonstração e o ciclo de chaves', async () => {
    const { user } = renderPortal(mockNotasApi)
    await user.click(consentimento())
    const simular = screen.getByRole('button', { name: 'Simular leitura de QR Code' })
    await user.click(simular)
    await user.click(botaoEnviar())
    await screen.findByText('Nota de R$ 60,00 validada.')
    await user.click(simular)
    await user.click(botaoEnviar())
    expect(await screen.findByText('Voucher de estacionamento grátis')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /^Nota duplicada/ }))
    await screen.findByRole('alert')

    await user.click(screen.getByRole('button', { name: 'Reiniciar demonstração' }))
    expect(campoChave().value).toBe('')
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
    expect(await within(cardDe('Seu progresso hoje')).findByText('R$ 0,00')).toBeTruthy()
    expect(await screen.findByText('Nenhuma nota enviada hoje. Cadastre a primeira acima.')).toBeTruthy()
    await waitFor(() => expect(screen.queryByText('Voucher de estacionamento grátis')).toBeNull())
    await user.click(simular)
    expect(digitos(campoChave().value)).toBe(CHAVES_DEMO.VALIDA_60)
  })

  it('C28 ordem de validação mostra os 7 itens da captura', () => {
    renderPortal(apiFalsa())
    const itens = within(screen.getByRole('list', { name: 'Ordem de validação' }))
      .getAllByRole('listitem')
      .map((li) => normalizar(li.textContent))
    expect(screen.getByText('Ordem de validação (mock do backend)')).toBeTruthy()
    expect(itens).toEqual([
      'CPF válido + consentimento LGPD (RN04)',
      'Chave com 44 dígitos e dígito verificador (RF01)',
      'Chave nunca cadastrada (ReN01)',
      'Consulta à SEFAZ simulada (RF02)',
      'CNPJ emissor é lojista ativo (RF03)',
      'Emitida há no máximo 72h (ReN02)',
      'Soma do dia ≥ R$ 150 → voucher (ReN03/ReN04)',
    ])
  })

  it('C29 backend real esconde reiniciar e o rodapé do mock', () => {
    vi.stubEnv('VITE_BACKEND_CONSUMIDOR', 'true')
    const { unmount } = renderPortal(mockNotasApi)
    expect(screen.queryByRole('button', { name: 'Reiniciar demonstração' })).toBeNull()
    expect(screen.queryByText('Consulta fiscal simulada (MockSefazGateway)')).toBeNull()
    unmount()

    vi.unstubAllEnvs()
    renderPortal(mockNotasApi)
    expect(screen.getByRole('button', { name: 'Reiniciar demonstração' })).toBeTruthy()
    expect(screen.getByText('Consulta fiscal simulada (MockSefazGateway)')).toBeTruthy()
  })
})

describe('montagem', () => {
  it('C40 App renderiza a Tela 1 no lugar da vitrine', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>,
    )
    expect(screen.getByText('Estacionamento grátis')).toBeTruthy()
    expect(screen.getByText('Cadastrar nota fiscal (NFC-e)')).toBeTruthy()
    expect(screen.queryByText('Aguardando implementação')).toBeNull()
  })
})
