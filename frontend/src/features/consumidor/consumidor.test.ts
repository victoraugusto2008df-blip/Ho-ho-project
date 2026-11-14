import { describe, expect, it, vi } from 'vitest'
import { CHAVES_DEMO } from './chavesDemo'
import { criarRealNotasApi } from './realNotasApi'
import type { Fetcher } from './notasApi'
import { faltanteDaMeta, formatarReais, formatarValidoAte, percentualDaMeta } from './regras'
import { NegocioError, type CodigoNegocio } from './types'

async function codigoDoErro(promessa: Promise<unknown>): Promise<CodigoNegocio | 'generico' | 'resolveu'> {
  try {
    await promessa
    return 'resolveu'
  } catch (erro) {
    return erro instanceof NegocioError ? erro.codigo : 'generico'
  }
}

describe('regras da Tela 1', () => {
  it('C10 validoAte de hoje e de outro dia saem no formato do voucher', () => {
    const agora = new Date(2026, 10, 14, 14, 19)
    expect(formatarValidoAte(new Date(2026, 10, 14, 22, 0).toISOString(), agora)).toBe('Hoje, 22:00 (fechamento)')
    expect(formatarValidoAte(new Date(2026, 10, 15, 20, 0).toISOString(), agora)).toBe('15/11, 20:00 (fechamento)')
  })

  it('C33 percentual e faltante da meta respeitam os limites', () => {
    expect(percentualDaMeta(0)).toBe(0)
    expect(percentualDaMeta(75)).toBe(50)
    expect(percentualDaMeta(150)).toBe(100)
    expect(percentualDaMeta(208.33)).toBe(100)
    expect(percentualDaMeta(-10)).toBe(0)
    expect(faltanteDaMeta(0)).toBe(150)
    expect(faltanteDaMeta(149.99)).toBe(0.01)
    expect(faltanteDaMeta(208.33)).toBe(0)
  })

  it('C42 abaixo da meta o percentual nunca chega a 100', async () => {
    expect(percentualDaMeta(149.25)).toBe(99)
    expect(percentualDaMeta(149.99)).toBe(99)
    expect(percentualDaMeta(150)).toBe(100)
    expect(percentualDaMeta(150.01)).toBe(100)
  })

  it('C34 chaves de demonstração têm 44 dígitos e são distintas', () => {
    const chaves = [
      CHAVES_DEMO.VALIDA_65,
      CHAVES_DEMO.VALIDA_85,
      CHAVES_DEMO.VALIDA_55,
      CHAVES_DEMO.DUPLICADA,
      CHAVES_DEMO.ANTIGA,
      CHAVES_DEMO.LOJA_NAO_CREDENCIADA,
    ]
    for (const chave of chaves) expect(chave).toMatch(/^\d{44}$/)
    expect(new Set(chaves).size).toBe(6)
  })

  it('C38 valores em reais saem no formato brasileiro', () => {
    const normalizar = (s: string) => s.replace(/\s/g, ' ')
    expect(normalizar(formatarReais(208.33))).toBe('R$ 208,33')
    expect(normalizar(formatarReais(0))).toBe('R$ 0,00')
    expect(normalizar(formatarReais(1420))).toBe('R$ 1.420,00')
  })
})

describe('backend real', () => {
  const notaBackend = {
    chaveAcesso: CHAVES_DEMO.VALIDA_65,
    valorTotal: 65,
    dataEmissao: '2026-11-14T15:00:00Z',
    status: 'APROVADA',
    clienteId: '33333333-3333-3333-3333-333333333301',
    lojaId: '22222222-2222-2222-2222-222222222201',
    estabelecimento: 'Zara Shopping Hub',
    categoria: 'Vestuário',
  }
  const notaDaTela = {
    chave: CHAVES_DEMO.VALIDA_65,
    estabelecimento: 'Zara Shopping Hub',
    categoria: 'Vestuário',
    dataEmissao: '2026-11-14T15:00:00Z',
    valor: 65,
    status: 'APROVADA',
  }

  it('INT-13 traduz a nota do backend para a forma da tela', async () => {
    const fetcher = vi.fn(async (path: string) => (path === '/notas' ? notaBackend : [notaBackend]))
    const api = criarRealNotasApi(fetcher as unknown as Fetcher)

    expect(await api.enviarNota(CHAVES_DEMO.VALIDA_65)).toEqual(notaDaTela)
    const [path, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit]
    expect(path).toBe('/notas')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toEqual({ chaveAcesso: CHAVES_DEMO.VALIDA_65 })

    expect(await api.listarNotasHoje()).toEqual([notaDaTela])
    expect(fetcher.mock.calls[1]).toEqual(['/notas/hoje'])
  })

  it('INT-16 traduz o benefício e o voucher do backend', async () => {
    const semVoucher = {
      valorAcumulado: 65,
      meta: 150,
      percentual: 43,
      valorFaltante: 85,
      voucherLiberado: false,
      cpfMascarado: '***.456.789-**',
      voucher: null,
    }
    const comVoucher = {
      ...semVoucher,
      valorAcumulado: 150,
      percentual: 100,
      valorFaltante: 0,
      voucherLiberado: true,
      voucher: {
        id: '7d1c2f3a-0000-4000-8000-000000000001',
        codigoQr: 'HOHO-PARK-2026-11-14-ABCD1234',
        status: 'LIBERADO',
        dataReferencia: '2026-11-14',
        criadoEm: '2026-11-14T17:19:00Z',
      },
    }
    let resposta: unknown = semVoucher
    const fetcher = vi.fn(async () => resposta)
    const api = criarRealNotasApi(fetcher as unknown as Fetcher)

    expect(await api.beneficioHoje()).toEqual({
      valorAcumulado: 65,
      meta: 150,
      percentual: 43,
      faltante: 85,
      cpfMascarado: '***.456.789-**',
      voucher: null,
    })
    expect(fetcher).toHaveBeenLastCalledWith('/beneficios/estacionamento/hoje')

    resposta = comVoucher
    // Sábado 14/11/2026 fecha às 22h; domingo 15/11/2026, às 20h (hora local).
    for (const [agora, fechamento] of [
      [new Date(2026, 10, 14, 15, 0), new Date(2026, 10, 14, 22, 0)],
      [new Date(2026, 10, 15, 15, 0), new Date(2026, 10, 15, 20, 0)],
    ]) {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(agora)
      const beneficio = await api.beneficioHoje()
      vi.useRealTimers()
      expect(beneficio.faltante).toBe(0)
      expect(beneficio.voucher).toEqual({
        codigo: 'HOHO-PARK-2026-11-14-ABCD1234',
        status: 'LIBERADO',
        emitidoEm: '2026-11-14T17:19:00Z',
        validoAte: fechamento.toISOString(),
        qrPayload: 'HOHO-PARK-2026-11-14-ABCD1234',
      })
    }
  })

  it('INT-11 converte cada code do backend em erro de negócio e o resto em genérico', async () => {
    const casos: Array<[unknown, CodigoNegocio | 'generico']> = [
      [{ status: 409, body: { code: 'NOTA_DUPLICADA', message: 'x' } }, 'NOTA_DUPLICADA'],
      [{ status: 422, body: { code: 'NOTA_EXPIRADA_72H', message: 'x' } }, 'NOTA_EXPIRADA_72H'],
      [{ status: 422, body: { code: 'LOJA_NAO_CREDENCIADA', message: 'x' } }, 'LOJA_NAO_CREDENCIADA'],
      [{ status: 400, body: { code: 'CHAVE_INVALIDA', message: 'x' } }, 'CHAVE_INVALIDA'],
      [{ status: 404, body: { code: 'CHAVE_NAO_ENCONTRADA', message: 'x' } }, 'CHAVE_NAO_ENCONTRADA'],
      [{ status: 409, body: { code: 'OUTRO', message: 'x' } }, 'generico'],
      [{ status: 422, body: { codigo: 'NOTA_DUPLICADA', mensagem: 'x' } }, 'generico'],
      [{ status: 500, body: null }, 'generico'],
      [new TypeError('Failed to fetch'), 'generico'],
    ]
    for (const [rejeicao, esperado] of casos) {
      const fetcher = (async () => {
        throw rejeicao
      }) as Fetcher
      expect(await codigoDoErro(criarRealNotasApi(fetcher).enviarNota(CHAVES_DEMO.VALIDA_65))).toBe(esperado)
    }
  })
})
