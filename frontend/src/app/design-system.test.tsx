import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ButtonProps } from '@/components/ui/Button'
import { renderApp } from '@/test/renderApp'
import { makeToken, nowSeconds } from '@/test/helpers'

vi.mock('@/components/ui/Button', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/components/ui/Button')>()
  return {
    ...original,
    Button: (props: ButtonProps) => <original.Button data-ds="button" {...props} />,
  }
})

const isDsButton = (name: string) =>
  screen.getByRole('button', { name }).getAttribute('data-ds') === 'button'

describe('primitivo Button', () => {
  it('C36 controles do shell e do acesso usam o primitivo Button', () => {
    const acesso = renderApp({ path: '/acesso' })
    for (const name of ['Entrar como Consumidor', 'Entrar como Lojista', 'Entrar como Admin Shopping']) {
      expect(isDsButton(name)).toBe(true)
    }
    acesso.unmount()

    renderApp({
      path: '/lojista',
      token: makeToken({ role: 'LOJISTA', exp: nowSeconds() + 600 }),
    })
    expect(isDsButton('Sair')).toBe(true)
    expect(isDsButton('Abrir menu')).toBe(true)
  })
})
