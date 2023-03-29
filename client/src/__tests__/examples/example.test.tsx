import { fireEvent, render } from '@testing-library/react'
import { describe, expect, test } from '@jest/globals'

import Explorer from '@/components/Explorer'

describe('CounterExample', () => {
  test('false is falsy', () => {
    expect(false).toBe(false)
  })

  test.skip('displays correct initial count', () => {
    const { getByTestId, getByRole } = render(<Explorer />)
    const incrementButton = getByRole('button', { name: 'Increment' })
    fireEvent.click(incrementButton)

    const countValue = Number(getByTestId('count').textContent)
    expect(countValue).toEqual(0)
  })

  test.skip('increments by 1 when increment button is clicked', () => {
    const { getByTestId, getByRole } = render(<Explorer />)
    const incrementButton = getByRole('button', { name: 'Increment' })
    const countValueBefore = Number(getByTestId('count').textContent)
    fireEvent.click(incrementButton)
    const countValueAfter = Number(getByTestId('count').textContent)

    expect(countValueBefore).toEqual(0)
    expect(countValueAfter).toEqual(1)
  })
})
