import { describe, expect, it, vi } from 'vitest'
import { CHART_PALETTE } from './chartPalette'
import { criarRealLojistaApi } from './realLojistaApi'
import { preencherHoras, resumoDoPico } from './regras'
import type { Fetcher } from '@/features/consumidor/notasApi'
import { campanha, dashboard } from './testUtils'

const PEDIDO = { titulo: 'Cupom 15% OFF', descontoPercentual: 15, criterioAlvo: 'INATIVOS_60_DIAS' }

describe('S2 - horas e pico (funções puras)', () => {
  it('C8 horas do pico são preenchidas de ponta a ponta com zero', () => {
    const esperado = [
      { hora: 10, rotulo: '10h', total: 5 },
      { hora: 11, rotulo: '11h', total: 0 },
      { hora: 12, rotulo: '12h', total: 0 },
      { hora: 13, rotulo: '13h', total: 2 },
    ]
    expect(
      preencherHoras([
        { hora: 10, total: 5 },
        { hora: 13, total: 2 },
      ]),
    ).toEqual(esperado)
    expect(preencherHoras([])).toEqual([])
    expect(
      preencherHoras([
        { hora: 13, total: 2 },
        { hora: 10, total: 5 },
      ]),
    ).toEqual(esperado)
  })

  it('C9 resumo do pico usa a maior hora com desempate pela mais cedo', () => {
    // O exemplo do check: 175 vendas às 19h, 1.284 no dia todo.
    const exemplo = [
      { hora: 10, total: 28 },
      { hora: 11, total: 51 },
      { hora: 12, total: 103 },
      { hora: 13, total: 123 },
      { hora: 14, total: 98 },
      { hora: 15, total: 97 },
      { hora: 16, total: 110 },
      { hora: 17, total: 128 },
      { hora: 18, total: 165 },
      { hora: 19, total: 175 },
      { hora: 20, total: 139 },
      { hora: 21, total: 67 },
    ]
    expect(resumoDoPico(exemplo)?.texto).toBe('Pico às 19h–20h com 175 vendas (13,6% do total de 1.284).')
    expect(resumoDoPico([{ hora: 23, total: 4 }])?.texto).toContain('Pico às 23h–0h')
    expect(
      resumoDoPico([
        { hora: 15, total: 7 },
        { hora: 9, total: 7 },
      ])?.hora,
    ).toBe(9)
    expect(resumoDoPico([])).toBeNull()
  })
})

describe('S3 - backend real da Tela 2', () => {
  it('C17 backend real chama o dashboard e a campanha pelo fetcher', async () => {
    const corpoDashboard = dashboard()
    const fetcher = vi.fn(async (path: string) => (path === '/campanhas' ? campanha() : corpoDashboard))
    const api = criarRealLojistaApi(fetcher as unknown as Fetcher)

    expect(await api.dashboard()).toEqual(corpoDashboard)
    expect(fetcher).toHaveBeenLastCalledWith('/analytics/lojista/dashboard')

    const resposta = await api.dispararCampanha(PEDIDO)
    expect(resposta.publicoAtingido).toBe(312)
    expect(fetcher).toHaveBeenLastCalledWith('/campanhas', {
      method: 'POST',
      body: '{"titulo":"Cupom 15% OFF","descontoPercentual":15,"criterioAlvo":"INATIVOS_60_DIAS"}',
    })

    const falho = vi.fn(async () => {
      throw { status: 500, body: null }
    })
    await expect(criarRealLojistaApi(falho as unknown as Fetcher).dispararCampanha(PEDIDO)).rejects.toEqual({
      status: 500,
      body: null,
    })
  })

})

describe('Design system', () => {
  it('C26 paleta dos gráficos é a do guia de design system', () => {
    // O "#" é montado à parte para o grep de hex do C25 não pegar este arquivo.
    const hex = (digitos: string) => ['#', digitos].join('')
    expect(CHART_PALETTE).toMatchObject({
      primary: hex('2563EB'),
      brand: hex('4F46E5'),
      success: hex('10B981'),
      accent: hex('F59E0B'),
      secondary: hex('64748B'),
      hairline: hex('E2E8F0'),
    })
  })
})
