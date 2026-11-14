import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CHAVES_DEMO, mockNotasApi } from './mockNotasApi'
import { criarNotasApi } from './createNotasApi'
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
      CHAVES_DEMO.VALIDA_60,
      CHAVES_DEMO.VALIDA_90,
      CHAVES_DEMO.VALIDA_40,
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

describe('mock da demonstração', () => {
  beforeEach(() => mockNotasApi.reiniciar())

  it('C35 mock recusa cada caso de negócio sem tocar no acumulado', async () => {
    await mockNotasApi.enviarNota(CHAVES_DEMO.VALIDA_60)
    expect(await codigoDoErro(mockNotasApi.enviarNota(CHAVES_DEMO.VALIDA_60))).toBe('NOTA_DUPLICADA')
    expect(await codigoDoErro(mockNotasApi.enviarNota(CHAVES_DEMO.DUPLICADA))).toBe('NOTA_DUPLICADA')
    expect(await codigoDoErro(mockNotasApi.enviarNota(CHAVES_DEMO.ANTIGA))).toBe('NOTA_ANTIGA')
    expect(await codigoDoErro(mockNotasApi.enviarNota(CHAVES_DEMO.LOJA_NAO_CREDENCIADA))).toBe('LOJA_NAO_CREDENCIADA')
    expect(await codigoDoErro(mockNotasApi.enviarNota('1'.repeat(43)))).toBe('CHAVE_INVALIDA')

    const notas = await mockNotasApi.listarNotasHoje()
    expect(notas.map((n) => n.chave)).toEqual([CHAVES_DEMO.VALIDA_60])
    expect((await mockNotasApi.beneficioHoje()).valorAcumulado).toBe(60)
  })

  it('C36 mock libera um único voucher ao atingir a meta', async () => {
    await mockNotasApi.enviarNota(CHAVES_DEMO.VALIDA_60)
    expect((await mockNotasApi.beneficioHoje()).voucher).toBeNull()

    await mockNotasApi.enviarNota(CHAVES_DEMO.VALIDA_90)
    const naMeta = await mockNotasApi.beneficioHoje()
    expect(naMeta.valorAcumulado).toBe(150)
    expect(naMeta.percentual).toBe(100)
    expect(naMeta.voucher?.status).toBe('LIBERADO')
    const codigo = naMeta.voucher?.codigo

    await mockNotasApi.enviarNota(CHAVES_DEMO.VALIDA_40)
    const depois = await mockNotasApi.beneficioHoje()
    expect(depois.valorAcumulado).toBe(190)
    expect(depois.voucher?.codigo).toBe(codigo)
  })

  it('C37 mock devolve notas e benefício na forma do contrato', async () => {
    const nota = await mockNotasApi.enviarNota(CHAVES_DEMO.VALIDA_60)
    const hoje = new Date()
    const emissao = new Date(nota.dataEmissao)
    expect(nota.status).toBe('APROVADA')
    expect(nota.dataEmissao).toBe(emissao.toISOString())
    expect(emissao.toDateString()).toBe(hoje.toDateString())
    expect(nota.estabelecimento.trim()).not.toBe('')
    expect(nota.categoria.trim()).not.toBe('')
    expect((await mockNotasApi.beneficioHoje()).cpfMascarado).toBe('***.982.247-**')
  })
})

describe('backend real', () => {
  it('C30 backend real chama as 3 rotas do contrato pelo fetcher', async () => {
    const nota = {
      chave: CHAVES_DEMO.VALIDA_60,
      estabelecimento: 'Renner Shopping Hub',
      categoria: 'Vestuário',
      dataEmissao: '2026-11-14T15:00:00.000Z',
      valor: 60,
      status: 'APROVADA',
    }
    const beneficio = {
      valorAcumulado: 60,
      meta: 150,
      percentual: 40,
      faltante: 90,
      cpfMascarado: '***.982.247-**',
      voucher: null,
    }
    const fetcher = vi.fn(async (path: string) => {
      if (path === '/notas') return nota
      if (path === '/notas/hoje') return [nota]
      if (path === '/beneficios/estacionamento/hoje') return beneficio
      throw new Error(`rota inesperada ${path}`)
    })
    const api = criarRealNotasApi(fetcher as unknown as Fetcher)

    expect(await api.enviarNota(CHAVES_DEMO.VALIDA_60)).toEqual(nota)
    const [path, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit]
    expect(path).toBe('/notas')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toEqual({ chaveAcesso: CHAVES_DEMO.VALIDA_60 })

    expect(await api.listarNotasHoje()).toEqual([nota])
    expect(fetcher.mock.calls[1][0]).toBe('/notas/hoje')
    expect(await api.beneficioHoje()).toEqual(beneficio)
    expect(fetcher.mock.calls[2][0]).toBe('/beneficios/estacionamento/hoje')
  })

  it('C31 backend real converte 409 e 422 em erro de negócio e o resto em genérico', async () => {
    const casos: Array<[unknown, CodigoNegocio | 'generico']> = [
      [{ status: 409, body: { codigo: 'NOTA_DUPLICADA', mensagem: 'x' } }, 'NOTA_DUPLICADA'],
      [{ status: 422, body: { codigo: 'NOTA_ANTIGA', mensagem: 'x' } }, 'NOTA_ANTIGA'],
      [{ status: 422, body: { codigo: 'LOJA_NAO_CREDENCIADA', mensagem: 'x' } }, 'LOJA_NAO_CREDENCIADA'],
      [{ status: 422, body: { codigo: 'CHAVE_INVALIDA', mensagem: 'x' } }, 'CHAVE_INVALIDA'],
      [{ status: 422, body: { codigo: 'OUTRO', mensagem: 'x' } }, 'generico'],
      [{ status: 500, body: null }, 'generico'],
    ]
    for (const [rejeicao, esperado] of casos) {
      const fetcher = (async () => {
        throw rejeicao
      }) as Fetcher
      expect(await codigoDoErro(criarRealNotasApi(fetcher).enviarNota(CHAVES_DEMO.VALIDA_60))).toBe(esperado)
    }
  })

  it('C32 só a flag exata true liga o backend real', async () => {
    const fetcher = vi.fn(async () => [])
    for (const valor of [undefined, 'false', 'TRUE']) {
      vi.unstubAllEnvs()
      if (valor !== undefined) vi.stubEnv('VITE_BACKEND_CONSUMIDOR', valor)
      expect(criarNotasApi(fetcher as unknown as Fetcher)).toBe(mockNotasApi)
    }
    vi.stubEnv('VITE_BACKEND_CONSUMIDOR', 'true')
    const real = criarNotasApi(fetcher as unknown as Fetcher)
    expect(real).not.toBe(mockNotasApi)
    await real.listarNotasHoje()
    expect(fetcher).toHaveBeenCalledWith('/notas/hoje')
  })
})
